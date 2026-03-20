import type { ParsedFile } from '../parser/types';
import type { ModuleDefinition } from './types';

/**
 * Extracts the last meaningful segment from a module source path.
 * Used to identify the module type for icon mapping (D8) and labeling.
 *
 * @example
 * normalizeSourcePath('./../../../../../../utils/modules/api-gateway-lambda')
 * // → 'api-gateway-lambda'
 *
 * normalizeSourcePath('../../../resources/070-microservices')
 * // → '070-microservices'
 *
 * normalizeSourcePath('hashicorp/consul/aws')
 * // → 'aws'
 */
export const normalizeSourcePath = (source: string): string => {
  const segments = source.replace(/\/+$/, '').split('/');
  return segments[segments.length - 1] ?? source;
};

/**
 * Scans a module's source files (variables.tf, outputs.tf) to extract
 * the list of declared variable names and output names.
 * This allows the visualizer to understand what a module accepts and exposes.
 *
 * @example
 * // Given the parsed files of utils/modules/api-gateway-lambda/:
 * // - variables.tf defines: name, app_image, lambda_timeout, env, environments, ...
 * // - outputs.tf defines: api_gateway_url, api_gateway_domain_name, lambda_function_arn, ...
 *
 * resolveModuleDefinition('api-gateway-lambda', parsedFiles)
 * // → {
 * //   sourcePath: 'api-gateway-lambda',
 * //   variables: ['name', 'app_image', 'lambda_timeout', 'env', 'environments', ...],
 * //   outputs: ['api_gateway_url', 'api_gateway_domain_name', 'lambda_function_arn', ...],
 * // }
 */
export const resolveModuleDefinition = (
  normalizedSource: string,
  allFiles: ParsedFile[],
): ModuleDefinition | null => {
  const moduleFiles = allFiles.filter((f) =>
    f.path.includes(normalizedSource),
  );

  if (moduleFiles.length === 0) return null;

  const variables: string[] = [];
  const outputs: string[] = [];

  for (const file of moduleFiles) {
    for (const resource of file.resources) {
      if (resource.type === 'variable') {
        variables.push(resource.name);
      } else if (resource.type === 'output') {
        outputs.push(resource.name);
      }
    }
  }

  return {
    sourcePath: normalizedSource,
    variables,
    outputs,
  };
};

/**
 * Builds a lookup map of all module definitions found in the parsed files.
 * Keys are normalized source paths (e.g. "api-gateway-lambda"),
 * values are the module's variable/output declarations.
 *
 * @example
 * const defs = buildModuleDefinitionMap(parsedFiles);
 * defs.get('api-gateway-lambda')
 * // → { sourcePath: 'api-gateway-lambda', variables: [...], outputs: [...] }
 *
 * defs.get('datasource-etl')
 * // → { sourcePath: 'datasource-etl', variables: [...], outputs: [...] }
 */
export const buildModuleDefinitionMap = (
  allFiles: ParsedFile[],
): Map<string, ModuleDefinition> => {
  const moduleSources = new Set<string>();

  for (const file of allFiles) {
    for (const resource of file.resources) {
      if (resource.type === 'module' && resource.source) {
        moduleSources.add(normalizeSourcePath(resource.source));
      }
    }
  }

  const definitions = new Map<string, ModuleDefinition>();

  for (const source of moduleSources) {
    const def = resolveModuleDefinition(source, allFiles);
    if (def) {
      definitions.set(source, def);
    }
  }

  return definitions;
};
