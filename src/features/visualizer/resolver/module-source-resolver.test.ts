import { describe, expect, it } from 'vitest';

import { parseFiles, type FileInput } from '../parser/hcl-parser';
import type { ParsedFile } from '../parser/types';

import moduleOutputsTf from './fixtures/api-gateway-lambda/outputs.tf?raw';
import moduleVariablesTf from './fixtures/api-gateway-lambda/variables.tf?raw';
import consumerTf from './fixtures/consumer.tf?raw';
import {
  buildModuleDefinitionMap,
  normalizeSourcePath,
  resolveModuleDefinition,
} from './module-source-resolver';

const moduleFiles: FileInput[] = [
  { path: 'utils/modules/api-gateway-lambda/variables.tf', content: moduleVariablesTf },
  { path: 'utils/modules/api-gateway-lambda/outputs.tf', content: moduleOutputsTf },
];

const consumerFile: FileInput = {
  path: 'resources/070-microservices/checkout.tf',
  content: consumerTf,
};

const parseAll = async (files: FileInput[]): Promise<ParsedFile[]> => {
  const result = await parseFiles(files);
  expect(result.errors).toEqual([]);
  return result.files;
};

describe('normalizeSourcePath', () => {
  it('keeps the last segment of a relative module path', () => {
    expect(normalizeSourcePath('./../../../../utils/modules/api-gateway-lambda')).toBe(
      'api-gateway-lambda',
    );
  });

  it('keeps the last segment of a registry source', () => {
    expect(normalizeSourcePath('hashicorp/consul/aws')).toBe('aws');
  });

  it('ignores trailing slashes', () => {
    expect(normalizeSourcePath('../../utils/modules/cloudfront-s3//')).toBe('cloudfront-s3');
  });

  it('leaves a bare name untouched', () => {
    expect(normalizeSourcePath('api-gateway-lambda')).toBe('api-gateway-lambda');
  });
});

describe('resolveModuleDefinition', () => {
  it('collects the variables and outputs the module declares', async () => {
    const files = await parseAll([...moduleFiles, consumerFile]);

    const definition = resolveModuleDefinition('api-gateway-lambda', files);

    expect(definition).not.toBeNull();
    expect(definition?.sourcePath).toBe('api-gateway-lambda');
    expect(new Set(definition?.variables)).toEqual(
      new Set(['name', 'app_image', 'env', 'lambda_timeout', 'environments']),
    );
    expect(new Set(definition?.outputs)).toEqual(
      new Set(['api_gateway_url', 'api_gateway_domain_name', 'lambda_function_arn']),
    );
  });

  it('returns null when no file belongs to the module', async () => {
    const files = await parseAll([consumerFile]);

    expect(resolveModuleDefinition('api-gateway-lambda', files)).toBeNull();
  });
});

describe('buildModuleDefinitionMap', () => {
  it('indexes only the module sources whose files are in the set', async () => {
    const files = await parseAll([...moduleFiles, consumerFile]);

    const definitions = buildModuleDefinitionMap(files);

    expect([...definitions.keys()]).toEqual(['api-gateway-lambda']);
    expect(definitions.get('api-gateway-lambda')?.outputs).toContain('api_gateway_url');
  });

  it('leaves out a module source with no files to read', async () => {
    const files = await parseAll([consumerFile]);

    expect(buildModuleDefinitionMap(files).size).toBe(0);
  });
});
