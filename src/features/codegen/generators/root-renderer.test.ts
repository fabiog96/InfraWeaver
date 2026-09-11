import { describe, expect, it } from 'vitest';

import type { GlobalConfig } from '../types';
import { renderCommonHcl, renderRootTerragruntHcl } from './root-renderer';

const config: GlobalConfig = {
  region: 'eu-west-1',
  environment: 'prod',
  project: 'infraweaver',
  subproject: 'platform',
  stateBucket: 'infraweaver-tfstate',
  lockTable: 'infraweaver-tflock',
  cicdProvider: 'github-actions',
};

describe('renderRootTerragruntHcl', () => {
  it('promotes the global config to terragrunt locals', () => {
    const hcl = renderRootTerragruntHcl(config);

    expect(hcl).toContain(
      [
        'locals {',
        '  region      = "eu-west-1"',
        '  environment = "prod"',
        '  project     = "infraweaver"',
        '  subproject  = "platform"',
        '}',
      ].join('\n'),
    );
  });

  it('points the encrypted s3 backend at the configured bucket and lock table', () => {
    const hcl = renderRootTerragruntHcl(config);

    expect(hcl).toContain('bucket         = "infraweaver-tfstate"');
    expect(hcl).toContain('dynamodb_table = "infraweaver-tflock"');
    expect(hcl).toContain('encrypt        = true');
  });

  it('leaves the terragrunt state key as an unevaluated interpolation', () => {
    expect(renderRootTerragruntHcl(config)).toContain(
      'key            = "${path_relative_to_include()}/terraform.tfstate"',
    );
  });

  it('generates a provider that tags every resource from the locals', () => {
    const hcl = renderRootTerragruntHcl(config);

    expect(hcl).toContain('generate "provider" {');
    expect(hcl).toContain('  region = "${local.region}"');
    expect(hcl).toContain(
      [
        '    tags = {',
        '      terraform   = "true"',
        '      environment = "${local.environment}"',
        '      project     = "${local.project}"',
        '      subproject  = "${local.subproject}"',
        '    }',
      ].join('\n'),
    );
  });

  it('closes the generated provider heredoc', () => {
    const hcl = renderRootTerragruntHcl(config);

    expect(hcl).toContain('contents  = <<EOF');
    expect(hcl).toContain('\nEOF\n}\n');
  });
});

describe('renderCommonHcl', () => {
  it('re-reads every local from the root terragrunt config', () => {
    expect(renderCommonHcl()).toBe(
      [
        'locals {',
        '  common_vars = read_terragrunt_config(find_in_parent_folders("terragrunt.hcl"))',
        '  region      = local.common_vars.locals.region',
        '  environment = local.common_vars.locals.environment',
        '  project     = local.common_vars.locals.project',
        '  subproject  = local.common_vars.locals.subproject',
        '}',
        '',
      ].join('\n'),
    );
  });
});
