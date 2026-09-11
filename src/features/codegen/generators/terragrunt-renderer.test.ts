import { describe, expect, it } from 'vitest';

import type { ModuleInput, ModuleSecret, TerraformModule } from '../types';
import type { DependencyBlock } from './dependency-resolver';
import { renderTerragruntHcl } from './terragrunt-renderer';

const buildModule = (overrides: Partial<TerraformModule> = {}): TerraformModule => ({
  id: 'test-module',
  category: 'compute',
  resourceBlocks: [],
  inputs: [],
  outputs: [],
  secrets: [],
  requiredProviders: ['aws'],
  ...overrides,
});

const input = (overrides: Partial<ModuleInput> & Pick<ModuleInput, 'name'>): ModuleInput => ({
  type: 'string',
  required: false,
  description: `the ${overrides.name}`,
  ...overrides,
});

const secret = (name: string, source: ModuleSecret['source']): ModuleSecret => ({
  name,
  source,
  description: `the ${name}`,
});

interface RenderOptions {
  inputValues?: Record<string, unknown>;
  secretValues?: Record<string, string>;
  dependencies?: DependencyBlock[];
}

const render = (
  module: TerraformModule,
  { inputValues = {}, secretValues = {}, dependencies = [] }: RenderOptions = {},
): string => renderTerragruntHcl(module, inputValues, secretValues, dependencies);

describe('renderTerragruntHcl', () => {
  it('always includes the root and the env configuration', () => {
    expect(render(buildModule())).toBe(
      [
        'include "root" {',
        '  path = find_in_parent_folders()',
        '}',
        '',
        'include "env" {',
        '  path = "${get_terragrunt_dir()}/../_env/common.hcl"',
        '}',
        '',
      ].join('\n'),
    );
  });

  it('omits the inputs block when nothing resolves to a value', () => {
    const module = buildModule({ inputs: [input({ name: 'name' })] });

    expect(render(module)).not.toContain('inputs = {');
  });

  it('renders the resolved inputs aligned on the equals sign', () => {
    const module = buildModule({
      inputs: [input({ name: 'name' }), input({ name: 'memory_size', type: 'number' })],
    });

    const hcl = render(module, { inputValues: { name: 'handler', memory_size: 256 } });

    expect(hcl).toContain(
      ['inputs = {', '  name        = "handler"', '  memory_size = 256', '}'].join('\n'),
    );
  });

  it('falls back to the input default when the user supplied no value', () => {
    const module = buildModule({ inputs: [input({ name: 'runtime', default: 'python3.12' })] });

    expect(render(module)).toContain('runtime = "python3.12"');
  });

  it('drops an input the user emptied, default included, unlike renderMainTf', () => {
    const module = buildModule({ inputs: [input({ name: 'runtime', default: 'python3.12' })] });

    const hcl = render(module, { inputValues: { runtime: '' } });

    expect(hcl).not.toContain('runtime');
    expect(hcl).not.toContain('python3.12');
  });

  it('skips the inputs that carry neither a value nor a default', () => {
    const module = buildModule({ inputs: [input({ name: 'description' })] });

    expect(render(module, { inputValues: { description: '' } })).not.toContain('description');
  });

  it('renders a dependency block for the declared dependency', () => {
    const dependencies: DependencyBlock[] = [
      { name: 'lambda', configPath: '../handler', outputMappings: [] },
    ];

    const hcl = render(buildModule(), { dependencies });

    expect(hcl).toContain(
      ['dependency "lambda" {', '  config_path = "../handler"', '}'].join('\n'),
    );
  });

  it('renders one block per dependency and aligns every mapped input together', () => {
    const module = buildModule({ inputs: [input({ name: 'region' })] });
    const dependencies: DependencyBlock[] = [
      {
        name: 'lambda',
        configPath: '../handler',
        outputMappings: [{ sourceOutput: 'arn', targetInput: 'function_arn' }],
      },
      {
        name: 'dynamodb',
        configPath: '../data-store',
        outputMappings: [{ sourceOutput: 'name', targetInput: 'table' }],
      },
    ];

    const hcl = render(module, { inputValues: { region: 'eu-west-1' }, dependencies });

    expect(hcl).toContain('dependency "lambda" {\n  config_path = "../handler"\n}');
    expect(hcl).toContain('dependency "dynamodb" {\n  config_path = "../data-store"\n}');
    expect(hcl).toContain(
      [
        'inputs = {',
        '  region       = "eu-west-1"',
        '  function_arn = dependency.lambda.outputs.arn',
        '  table        = dependency.dynamodb.outputs.name',
        '}',
      ].join('\n'),
    );
  });

  it('wires a mapped input to the dependency output instead of a literal', () => {
    const module = buildModule({ inputs: [input({ name: 'function_arn' })] });
    const dependencies: DependencyBlock[] = [
      {
        name: 'lambda',
        configPath: '../handler',
        outputMappings: [{ sourceOutput: 'function_arn', targetInput: 'function_arn' }],
      },
    ];

    const hcl = render(module, { inputValues: { function_arn: 'a-literal-value' }, dependencies });

    expect(hcl).toContain('function_arn = dependency.lambda.outputs.function_arn');
    expect(hcl).not.toContain('a-literal-value');
  });

  it('reads an env-sourced secret through get_env', () => {
    const module = buildModule({
      inputs: [input({ name: 'api_key' })],
      secrets: [secret('api_key', 'env')],
    });

    const hcl = render(module, {
      inputValues: { api_key: 'do-not-inline-me' },
      secretValues: { api_key: 'MY_API_KEY' },
    });

    expect(hcl).toContain('api_key = get_env("MY_API_KEY")');
    expect(hcl).not.toContain('do-not-inline-me');
  });

  it('uppercases the secret name when no env variable was configured', () => {
    const module = buildModule({ secrets: [secret('api_key', 'env')] });

    expect(render(module)).toContain('api_key = get_env("API_KEY")');
  });

  it('leaves a manual placeholder for the secrets held outside terragrunt', () => {
    const fromSecretsManager = buildModule({ secrets: [secret('db_password', 'secretsmanager')] });
    const fromSsm = buildModule({ secrets: [secret('db_password', 'ssm')] });

    expect(render(fromSecretsManager, { secretValues: { db_password: 'prod/db' } })).toContain(
      'db_password = "PLACEHOLDER_USE_SECRET_MANAGER" # Retrieve from AWS Secrets Manager: prod/db',
    );
    expect(render(fromSsm, { secretValues: { db_password: '/prod/db' } })).toContain(
      'db_password = "PLACEHOLDER_USE_SSM_PARAMETER" # Retrieve from SSM Parameter Store: /prod/db',
    );
  });
});
