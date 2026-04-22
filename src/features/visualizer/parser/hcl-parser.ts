import type {
  ParsedResource,
  ParsedFile,
  ParseError,
  ParseResult,
  BlockType,
} from './types';
import { extractReferences } from './reference-extractor';
import { mapBlockLocations, findBlockLocation } from './line-mapper';

type HclParsedObject = Record<string, unknown>;

/**
 * Extracts a code snippet from file content around a specific line number.
 * Shows surrounding lines with a `>` marker on the target line.
 * Used to provide context in parse error messages.
 *
 * @example
 * // Given a file where line 3 has a syntax error:
 * getSnippet(content, 3)
 * // → "  2 |   bucket = \"my-bucket\"\n> 3 |   tags = {\n  4 |   # missing closing brace"
 */
const getSnippet = (content: string, line: number, radius = 1): string => {
  const lines = content.split('\n');
  const start = Math.max(0, line - 1 - radius);
  const end = Math.min(lines.length, line + radius);
  return lines
    .slice(start, end)
    .map((l, i) => {
      const lineNum = start + i + 1;
      const marker = lineNum === line ? '>' : ' ';
      return `${marker} ${lineNum} | ${l}`;
    })
    .join('\n');
};

/**
 * Converts the JSON output from hcl2-parser into a flat array of ParsedResource objects.
 * Iterates over all block types (resource, data, module, variable, output, locals),
 * extracts attributes and cross-resource references, and maps each block to its
 * source line location.
 *
 * @example
 * // hcl2-parser returns JSON structured like:
 * // {
 * //   resource: { aws_s3_bucket: { my_bucket: [{ bucket: "my-bucket", tags: "${local.tags}" }] } },
 * //   module: { api: [{ source: "./modules/api", env: "${var.env}" }] },
 * // }
 * //
 * // This function flattens it into:
 * // [
 * //   { type: 'resource', resourceType: 'aws_s3_bucket', name: 'my_bucket', references: ['local.tags'], ... },
 * //   { type: 'module', resourceType: 'module', name: 'api', source: './modules/api', references: ['var.env'], ... },
 * // ]
 */
const parseResources = (
  parsed: HclParsedObject,
  filePath: string,
  _content: string,
  locations: ReturnType<typeof mapBlockLocations>,
): ParsedResource[] => {
  const resources: ParsedResource[] = [];

  const resourceBlock = parsed['resource'] as Record<string, Record<string, unknown[]>> | undefined;
  if (resourceBlock) {
    for (const [resourceType, instances] of Object.entries(resourceBlock)) {
      for (const [name, configs] of Object.entries(instances)) {
        const attrs = (configs as unknown[])[0] as Record<string, unknown>;
        const loc = findBlockLocation(locations, 'resource', resourceType, name);
        resources.push({
          type: 'resource',
          resourceType,
          name,
          attributes: attrs,
          references: extractReferences(attrs),
          filePath,
          lineStart: loc?.lineStart ?? 0,
          lineEnd: loc?.lineEnd ?? 0,
        });
      }
    }
  }

  const dataBlock = parsed['data'] as Record<string, Record<string, unknown[]>> | undefined;
  if (dataBlock) {
    for (const [dataType, instances] of Object.entries(dataBlock)) {
      for (const [name, configs] of Object.entries(instances)) {
        const attrs = (configs as unknown[])[0] as Record<string, unknown>;
        const loc = findBlockLocation(locations, 'data', dataType, name);
        resources.push({
          type: 'data',
          resourceType: dataType,
          name,
          attributes: attrs,
          references: extractReferences(attrs),
          filePath,
          lineStart: loc?.lineStart ?? 0,
          lineEnd: loc?.lineEnd ?? 0,
        });
      }
    }
  }

  const moduleBlock = parsed['module'] as Record<string, unknown[]> | undefined;
  if (moduleBlock) {
    for (const [name, configs] of Object.entries(moduleBlock)) {
      const attrs = (configs as unknown[])[0] as Record<string, unknown>;
      const source = typeof attrs['source'] === 'string' ? attrs['source'] : undefined;
      const loc = findBlockLocation(locations, 'module', undefined, name);
      resources.push({
        type: 'module',
        resourceType: 'module',
        name,
        attributes: attrs,
        references: extractReferences(attrs),
        source,
        filePath,
        lineStart: loc?.lineStart ?? 0,
        lineEnd: loc?.lineEnd ?? 0,
      });
    }
  }

  const variableBlock = parsed['variable'] as Record<string, unknown[]> | undefined;
  if (variableBlock) {
    for (const [name, configs] of Object.entries(variableBlock)) {
      const attrs = (configs as unknown[])[0] as Record<string, unknown>;
      const loc = findBlockLocation(locations, 'variable', undefined, name);
      resources.push({
        type: 'variable',
        resourceType: 'variable',
        name,
        attributes: attrs,
        references: extractReferences(attrs),
        filePath,
        lineStart: loc?.lineStart ?? 0,
        lineEnd: loc?.lineEnd ?? 0,
      });
    }
  }

  const outputBlock = parsed['output'] as Record<string, unknown[]> | undefined;
  if (outputBlock) {
    for (const [name, configs] of Object.entries(outputBlock)) {
      const attrs = (configs as unknown[])[0] as Record<string, unknown>;
      const loc = findBlockLocation(locations, 'output', undefined, name);
      resources.push({
        type: 'output',
        resourceType: 'output',
        name,
        attributes: attrs,
        references: extractReferences(attrs),
        filePath,
        lineStart: loc?.lineStart ?? 0,
        lineEnd: loc?.lineEnd ?? 0,
      });
    }
  }

  const localsBlock = parsed['locals'] as Record<string, unknown>[] | undefined;
  if (localsBlock) {
    for (const localsObj of localsBlock) {
      const loc = findBlockLocation(locations, 'locals');
      resources.push({
        type: 'locals',
        resourceType: 'locals',
        name: 'locals',
        attributes: localsObj,
        references: extractReferences(localsObj),
        filePath,
        lineStart: loc?.lineStart ?? 0,
        lineEnd: loc?.lineEnd ?? 0,
      });
    }
  }

  return resources;
};

/**
 * Parses a single HCL file content string using hcl2-parser (WASM).
 * Returns extracted resources and any parse errors encountered.
 * On parser failure, returns a descriptive error with line number and code snippet.
 */
const parseHclContent = async (
  content: string,
  filePath: string,
): Promise<{ resources: ParsedResource[]; errors: ParseError[] }> => {
  const { parseToObject } = await import('hcl2-parser');

  const result = await parseToObject(content);
  const [parsed, error] = result as [HclParsedObject | null, string | null];

  if (error) {
    const errorLine = extractErrorLine(error);
    return {
      resources: [],
      errors: [
        {
          level: 'parse_error',
          filePath,
          line: errorLine,
          message: error,
          snippet: errorLine ? getSnippet(content, errorLine) : undefined,
          suggestion: 'Check for unclosed brackets, missing quotes, or unsupported HCL syntax.',
        },
      ],
    };
  }

  if (!parsed) {
    return {
      resources: [],
      errors: [
        {
          level: 'parse_error',
          filePath,
          message: 'Parser returned empty result for non-empty file.',
          suggestion: 'The file may contain only comments or unsupported syntax.',
        },
      ],
    };
  }

  const locations = mapBlockLocations(content);
  const resources = parseResources(parsed, filePath, content, locations);

  return { resources, errors: [] };
};

/**
 * Attempts to extract a line number from an HCL parser error message.
 * Looks for patterns like "on <file> line 42" or ":42:".
 */
const extractErrorLine = (error: string): number | undefined => {
  const lineMatch = /on\s+.*?line\s+(\d+)/i.exec(error) ?? /:(\d+)[:,]/i.exec(error);
  return lineMatch ? parseInt(lineMatch[1], 10) : undefined;
};

export interface FileInput {
  path: string;
  content: string;
}

/**
 * Parses an array of HCL file inputs and returns a consolidated ParseResult.
 * Processes each file independently with best-effort semantics: a single broken file
 * produces an error entry but does not prevent other files from being parsed.
 * Returns parsed files, all accumulated errors, and aggregate statistics.
 *
 * @example
 * const result = await parseFiles([
 *   { path: 'main.tf', content: 'resource "aws_s3_bucket" "b" { bucket = "x" }' },
 *   { path: 'broken.tf', content: 'resource "aws_s3_bucket" {{{' },
 * ]);
 * // result.stats → { totalFiles: 2, parsedFiles: 1, skippedFiles: 1, totalResources: 1, totalErrors: 1 }
 * // result.files → [{ path: 'main.tf', resources: [...] }]
 * // result.errors → [{ level: 'parse_error', filePath: 'broken.tf', message: '...', snippet: '...' }]
 */
export const parseFiles = async (files: FileInput[]): Promise<ParseResult> => {
  const parsedFiles: ParsedFile[] = [];
  const allErrors: ParseError[] = [];
  let totalResources = 0;
  let parsedCount = 0;
  let skippedCount = 0;

  const blockTypes: BlockType[] = ['resource', 'module', 'data', 'variable', 'output', 'locals'];

  for (const file of files) {
    if (!file.content.trim()) {
      skippedCount++;
      allErrors.push({
        level: 'file_error',
        filePath: file.path,
        message: 'File is empty.',
      });
      continue;
    }

    try {
      const { resources, errors } = await parseHclContent(file.content, file.path);

      if (errors.length > 0 && resources.length === 0) {
        skippedCount++;
        allErrors.push(...errors);
        continue;
      }

      if (errors.length > 0) {
        allErrors.push(...errors);
      }

      const relevantResources = resources.filter((r) =>
        blockTypes.includes(r.type),
      );

      parsedFiles.push({
        path: file.path,
        content: file.content,
        resources: relevantResources,
      });

      totalResources += relevantResources.length;
      parsedCount++;
    } catch (err) {
      skippedCount++;
      allErrors.push({
        level: 'file_error',
        filePath: file.path,
        message: err instanceof Error ? err.message : 'Unknown error during parsing.',
        suggestion: 'This file could not be processed. It may use unsupported HCL features.',
      });
    }
  }

  return {
    files: parsedFiles,
    errors: allErrors,
    stats: {
      totalFiles: files.length,
      parsedFiles: parsedCount,
      skippedFiles: skippedCount,
      totalResources,
      totalErrors: allErrors.length,
    },
  };
};
