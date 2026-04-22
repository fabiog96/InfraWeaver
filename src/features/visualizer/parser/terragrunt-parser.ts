import type { ParseError, TerragruntConfig, TerragruntDependency } from './types';

type HclParsedObject = Record<string, unknown>;

interface TerragruntParseResult {
  config: TerragruntConfig | null;
  errors: ParseError[];
}

/**
 * Scans the `inputs` block of a Terragrunt config and collects which outputs
 * are referenced from each named dependency.
 * Returns a Map of dependency name → list of output names consumed.
 *
 * @example
 * // Given a Terragrunt inputs block like:
 * // inputs = {
 * //   topic_arn   = dependency.messaging.outputs.campaign_proximity_topic_arn
 * //   slack_token = dependency.integrations.outputs.slack_bot_token_secret_arn
 * //   slack_name  = dependency.integrations.outputs.slack_bot_token_secret_name
 * // }
 *
 * extractDependencyOutputs(inputs)
 * // → Map {
 * //   'messaging'    → ['campaign_proximity_topic_arn'],
 * //   'integrations' → ['slack_bot_token_secret_arn', 'slack_bot_token_secret_name'],
 * // }
 */
const extractDependencyOutputs = (inputs: Record<string, unknown>): Map<string, string[]> => {
  const outputsByDep = new Map<string, string[]>();

  const walk = (value: unknown): void => {
    if (typeof value === 'string') {
      const depRegex = /dependency\.([a-zA-Z_][a-zA-Z0-9_]*)\.outputs\.([a-zA-Z_][a-zA-Z0-9_]*)/g;
      let match;
      while ((match = depRegex.exec(value)) !== null) {
        const depName = match[1];
        const outputName = match[2];
        const existing = outputsByDep.get(depName) ?? [];
        if (!existing.includes(outputName)) {
          existing.push(outputName);
        }
        outputsByDep.set(depName, existing);
      }
    } else if (Array.isArray(value)) {
      for (const item of value) walk(item);
    } else if (value !== null && typeof value === 'object') {
      for (const val of Object.values(value as Record<string, unknown>)) walk(val);
    }
  };

  walk(inputs);
  return outputsByDep;
};

/**
 * Parses a single Terragrunt .hcl file and extracts its structural configuration:
 * - `terraform.source` — path to the Terraform module being invoked
 * - `dependency` blocks — named dependencies with config paths and consumed outputs
 * - `dependencies.paths` — ordered list of layer dependency paths
 * - `inputs` — key-value map passed to the Terraform module
 * - `include` blocks — references to parent configs (root.hcl, module defaults)
 *
 * Terragrunt-specific path functions like `get_terragrunt_dir()` are stripped
 * from config paths to produce clean relative paths.
 *
 * Returns null config with descriptive errors if the file cannot be parsed.
 *
 * @example
 * // Given infra/_env/070-microservices.hcl:
 * // terraform { source = "../../../resources/070-microservices" }
 * // dependency "messaging" { config_path = "${get_terragrunt_dir()}/../020-messaging" }
 * // inputs = { topic_arn = dependency.messaging.outputs.campaign_proximity_topic_arn }
 *
 * const { config } = await parseTerragruntContent(content, 'infra/_env/070-microservices.hcl');
 * // config → {
 * //   filePath: 'infra/_env/070-microservices.hcl',
 * //   terraformSource: '../../../resources/070-microservices',
 * //   dependencies: [{ name: 'messaging', configPath: '../020-messaging', outputs: ['campaign_proximity_topic_arn'] }],
 * //   dependencyPaths: [],
 * //   inputs: { topic_arn: '${dependency.messaging.outputs.campaign_proximity_topic_arn}' },
 * //   includes: {},
 * // }
 */
export const parseTerragruntContent = async (
  content: string,
  filePath: string,
): Promise<TerragruntParseResult> => {
  const { parseToObject } = await import('hcl2-parser');

  let parsed: HclParsedObject;
  try {
    const result = await parseToObject(content);
    const [obj, error] = result as [HclParsedObject | null, string | null];

    if (error || !obj) {
      return {
        config: null,
        errors: [
          {
            level: 'parse_error',
            filePath,
            message: error ?? 'Failed to parse Terragrunt file.',
            suggestion: 'Check for syntax errors in the Terragrunt configuration.',
          },
        ],
      };
    }

    parsed = obj;
  } catch (err) {
    return {
      config: null,
      errors: [
        {
          level: 'file_error',
          filePath,
          message: err instanceof Error ? err.message : 'Unknown error.',
        },
      ],
    };
  }

  let terraformSource: string | undefined;
  const terraformBlock = parsed['terraform'] as Record<string, unknown>[] | undefined;
  if (terraformBlock?.[0]) {
    const src = terraformBlock[0]['source'];
    if (typeof src === 'string') {
      terraformSource = src;
    }
  }

  const dependencies: TerragruntDependency[] = [];
  const dependencyBlock = parsed['dependency'] as Record<string, unknown[]> | undefined;
  if (dependencyBlock) {
    for (const [name, configs] of Object.entries(dependencyBlock)) {
      const attrs = (configs as unknown[])[0] as Record<string, unknown>;
      let configPath = '';
      if (typeof attrs['config_path'] === 'string') {
        configPath = attrs['config_path']
          .replace(/\$\{get_terragrunt_dir\(\)\}\//g, '')
          .replace(/\$\{get_terragrunt_dir\(\)\}/g, '');
      }
      dependencies.push({
        name,
        configPath,
        outputs: [],
      });
    }
  }

  let dependencyPaths: string[] = [];
  const dependenciesBlock = parsed['dependencies'] as Record<string, unknown>[] | undefined;
  if (dependenciesBlock?.[0]) {
    const paths = dependenciesBlock[0]['paths'];
    if (Array.isArray(paths)) {
      dependencyPaths = (paths as string[]).map((p) =>
        p
          .replace(/\$\{get_terragrunt_dir\(\)\}\//g, '')
          .replace(/\$\{get_terragrunt_dir\(\)\}/g, ''),
      );
    }
  }

  const inputs = (parsed['inputs'] as Record<string, unknown>) ?? {};

  const outputsByDep = extractDependencyOutputs(inputs);
  for (const dep of dependencies) {
    const outputs = outputsByDep.get(dep.name);
    if (outputs) {
      dep.outputs = outputs;
    }
  }

  const includes: Record<string, string> = {};
  const includeBlock = parsed['include'] as Record<string, unknown[]> | undefined;
  if (includeBlock) {
    for (const [name, configs] of Object.entries(includeBlock)) {
      const attrs = (configs as unknown[])[0] as Record<string, unknown>;
      if (typeof attrs['path'] === 'string') {
        includes[name] = attrs['path'];
      }
    }
  }

  return {
    config: {
      filePath,
      terraformSource,
      dependencies,
      dependencyPaths,
      inputs,
      includes,
    },
    errors: [],
  };
};
