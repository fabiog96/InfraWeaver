/**
 * Regex patterns used to identify Terraform/HCL references inside string values.
 * Pattern 0: interpolation syntax `${...}`
 * Pattern 1: bare references like `var.x`, `local.x`, `module.x.y`, `data.x.y`
 * Pattern 2: provider resource references like `aws_lambda_function.my_fn.arn`
 */
const REFERENCE_PATTERNS = [
  /\$\{([^}]+)\}/g,
  /(?<!\$\{)((?:var|local|module|data|each)\.[a-zA-Z_][a-zA-Z0-9_.[\]"]*)/g,
  /(?<!\$\{)((?:aws|google|azurerm)_[a-zA-Z_]+\.[a-zA-Z_][a-zA-Z0-9_]*\.[a-zA-Z_][a-zA-Z0-9_]*)/g,
];

/** Prefixes that represent internal Terraform context, not cross-resource dependencies. */
const IGNORED_PREFIXES = ['path.', 'self.', 'count.', 'terraform.', 'each.'];

/** Known Terraform and Terragrunt built-in functions to exclude from reference detection. */
const TERRAFORM_FUNCTIONS = new Set([
  'merge', 'concat', 'join', 'split', 'lookup', 'element', 'length',
  'file', 'templatefile', 'jsonencode', 'jsondecode', 'toset', 'tolist',
  'tomap', 'try', 'coalesce', 'coalescelist', 'lower', 'upper', 'trim',
  'trimprefix', 'trimsuffix', 'replace', 'format', 'formatlist',
  'contains', 'keys', 'values', 'flatten', 'distinct', 'sort',
  'setsubtract', 'setunion', 'setintersection', 'range', 'reverse',
  'zipmap', 'map', 'list', 'abs', 'ceil', 'floor', 'max', 'min',
  'parseint', 'signum', 'base64decode', 'base64encode', 'csvdecode',
  'cidrhost', 'cidrnetmask', 'cidrsubnet', 'regex', 'regexall',
  'can', 'nonsensitive', 'sensitive', 'tobool', 'tonumber', 'tostring',
  'find_in_parent_folders', 'get_terragrunt_dir', 'path_relative_to_include',
  'read_terragrunt_config',
]);

/** Returns true if the reference targets internal Terraform context (path, self, count, etc.). */
const isIgnored = (ref: string): boolean => {
  return IGNORED_PREFIXES.some((prefix) => ref.startsWith(prefix));
};

/** Returns true if the string starts with a known Terraform/Terragrunt function name. */
const isFunction = (ref: string): boolean => {
  const funcName = ref.split('(')[0].trim();
  return TERRAFORM_FUNCTIONS.has(funcName);
};

/**
 * Strips bracket accessors and quotes from a raw reference string to produce a clean identifier.
 *
 * @example
 * normalizeReference('aws_s3_bucket.my_bucket["key"]') // → 'aws_s3_bucket.my_bucket'
 * normalizeReference("local.secrets['db_password']")    // → 'local.secrets'
 */
const normalizeReference = (raw: string): string => {
  return raw
    .replace(/\[.*?\]/g, '')
    .replace(/["']/g, '')
    .trim();
};

/**
 * Extracts all cross-resource references from a single `${...}` interpolation expression.
 * Identifies var, local, module, data, provider-resource, and Terragrunt dependency references.
 *
 * @example
 * // Given the interpolation content (without the ${} wrapper):
 * extractFromInterpolation('aws_dynamodb_table.campaign.arn')
 * // → ['aws_dynamodb_table.campaign.arn']
 *
 * extractFromInterpolation('merge(local.tags, { name = var.env })')
 * // → ['local.tags', 'var.env']
 *
 * extractFromInterpolation('dependency.messaging.outputs.topic_arn')
 * // → ['dependency.messaging.outputs.topic_arn']
 */
const extractFromInterpolation = (expr: string): string[] => {
  const refs: string[] = [];

  const refRegex = /((?:var|local|module|data)\.[a-zA-Z_][a-zA-Z0-9_.]*)/g;
  let match;
  while ((match = refRegex.exec(expr)) !== null) {
    refs.push(normalizeReference(match[1]));
  }

  const resourceRegex = /((?:aws|google|azurerm)_[a-zA-Z_]+\.[a-zA-Z_][a-zA-Z0-9_.]*)/g;
  while ((match = resourceRegex.exec(expr)) !== null) {
    refs.push(normalizeReference(match[1]));
  }

  const depRegex = /(dependency\.[a-zA-Z_][a-zA-Z0-9_.]*)/g;
  while ((match = depRegex.exec(expr)) !== null) {
    refs.push(normalizeReference(match[1]));
  }

  return refs;
};

/**
 * Recursively walks an arbitrary value (string, array, object) and extracts all
 * Terraform/HCL cross-resource references found in string values.
 * Returns a deduplicated array of reference identifiers.
 *
 * @example
 * // Given the parsed attributes of a module block:
 * extractReferences({
 *   env: '${var.env}',
 *   dynamodb_table_arn: '${aws_dynamodb_table.campaign.arn}',
 *   cognito_user_pool_id: '${aws_cognito_user_pool.adklab.id}',
 *   tags: '${merge(local.common_tags, { subproject = "my-service" })}',
 * })
 * // → [
 * //   'var.env',
 * //   'aws_dynamodb_table.campaign.arn',
 * //   'aws_cognito_user_pool.adklab.id',
 * //   'local.common_tags',
 * // ]
 */
export const extractReferences = (value: unknown): string[] => {
  const refs = new Set<string>();

  const walk = (v: unknown): void => {
    if (typeof v === 'string') {
      const interpolationRegex = /\$\{([^}]+)\}/g;
      let match;
      while ((match = interpolationRegex.exec(v)) !== null) {
        for (const ref of extractFromInterpolation(match[1])) {
          if (!isIgnored(ref) && !isFunction(ref)) {
            refs.add(ref);
          }
        }
      }

      for (const pattern of REFERENCE_PATTERNS.slice(1)) {
        const patternCopy = new RegExp(pattern.source, pattern.flags);
        while ((match = patternCopy.exec(v)) !== null) {
          const ref = normalizeReference(match[1]);
          if (!isIgnored(ref) && !isFunction(ref)) {
            refs.add(ref);
          }
        }
      }
    } else if (Array.isArray(v)) {
      for (const item of v) {
        walk(item);
      }
    } else if (v !== null && typeof v === 'object') {
      for (const val of Object.values(v as Record<string, unknown>)) {
        walk(val);
      }
    }
  };

  walk(value);
  return Array.from(refs);
};
