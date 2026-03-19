import type { TerraformModule, ModuleSecret } from '../types';
import type { DependencyBlock } from './dependency-resolver';
import { formatHclValue } from './hcl-utils';

const renderSecretValue = (secret: ModuleSecret, secretName: string): string => {
  switch (secret.source) {
    case 'env':
      return `get_env("${secretName}")`;
    case 'secretsmanager':
      return `"PLACEHOLDER_USE_SECRET_MANAGER" # Retrieve from AWS Secrets Manager: ${secretName}`;
    case 'ssm':
      return `"PLACEHOLDER_USE_SSM_PARAMETER" # Retrieve from SSM Parameter Store: ${secretName}`;
    default:
      return `get_env("${secretName}")`;
  }
};

export const renderTerragruntHcl = (
  module: TerraformModule,
  inputValues: Record<string, unknown>,
  secretValues: Record<string, string>,
  dependencies: DependencyBlock[] = [],
): string => {
  const lines: string[] = [];

  lines.push('include "root" {');
  lines.push('  path = find_in_parent_folders()');
  lines.push('}');
  lines.push('');
  lines.push('include "env" {');
  lines.push('  path = "${get_terragrunt_dir()}/../_env/common.hcl"');
  lines.push('}');

  for (const dep of dependencies) {
    lines.push('');
    lines.push(`dependency "${dep.name}" {`);
    lines.push(`  config_path = "${dep.configPath}"`);
    lines.push('}');
  }

  const inputLines: string[] = [];
  const inputTypes: Record<string, string> = {};
  for (const input of module.inputs) {
    inputTypes[input.name] = input.type;
  }

  const mappedInputs = new Set<string>();
  for (const dep of dependencies) {
    for (const mapping of dep.outputMappings) {
      mappedInputs.add(mapping.targetInput);
    }
  }

  const allKeys = [
    ...module.inputs.map((i) => i.name),
    ...module.secrets.map((s) => s.name),
    ...Array.from(mappedInputs),
  ];
  const maxKeyLen = Math.max(...allKeys.map((k) => k.length), 1);

  for (const input of module.inputs) {
    if (mappedInputs.has(input.name)) continue;

    const value = inputValues[input.name] ?? input.default;
    if (value === undefined || value === null || value === '') continue;

    const isSecret = module.secrets.some((s) => s.name === input.name);
    if (isSecret) continue;

    const padding = ' '.repeat(maxKeyLen - input.name.length);
    inputLines.push(`  ${input.name}${padding} = ${formatHclValue(value, input.type)}`);
  }

  for (const secret of module.secrets) {
    const name = secretValues[secret.name] || secret.name.toUpperCase();
    const padding = ' '.repeat(maxKeyLen - secret.name.length);
    inputLines.push(`  ${secret.name}${padding} = ${renderSecretValue(secret, name)}`);
  }

  for (const dep of dependencies) {
    for (const mapping of dep.outputMappings) {
      const padding = ' '.repeat(maxKeyLen - mapping.targetInput.length);
      inputLines.push(`  ${mapping.targetInput}${padding} = dependency.${dep.name}.outputs.${mapping.sourceOutput}`);
    }
  }

  if (inputLines.length > 0) {
    lines.push('');
    lines.push('inputs = {');
    lines.push(...inputLines);
    lines.push('}');
  }

  return lines.join('\n') + '\n';
};
