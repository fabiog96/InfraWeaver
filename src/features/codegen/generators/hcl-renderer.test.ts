import { describe, expect, it } from 'vitest';

import type { ModuleInput, TerraformModule } from '../types';
import { renderMainTf } from './hcl-renderer';

const buildModule = (overrides: Partial<TerraformModule> = {}): TerraformModule => ({
  id: 'test-module',
  category: 'storage',
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

const bucketWithUnmappedPrefix = buildModule({
  resourceBlocks: [
    {
      resourceType: 'aws_s3_bucket',
      resourceName: 'this',
      attributes: [
        { attribute: 'bucket', fromInput: 'bucket_name' },
        { attribute: 'bucket_prefix', fromInput: 'unmapped_input' },
      ],
    },
  ],
  inputs: [input({ name: 'bucket_name' })],
});

describe('renderMainTf', () => {
  it('renders a resource block with the attributes aligned on the equals sign', () => {
    const module = buildModule({
      resourceBlocks: [
        {
          resourceType: 'aws_s3_bucket',
          resourceName: 'this',
          attributes: [
            { attribute: 'bucket', fromInput: 'bucket_name' },
            { attribute: 'force_destroy', fromInput: 'force_destroy' },
          ],
        },
      ],
      inputs: [input({ name: 'bucket_name' }), input({ name: 'force_destroy', type: 'bool' })],
    });

    const tf = renderMainTf(module, { bucket_name: 'assets', force_destroy: true });

    expect(tf).toBe(
      [
        'resource "aws_s3_bucket" "this" {',
        '  bucket        = "assets"',
        '  force_destroy = true',
        '}',
        '',
      ].join('\n'),
    );
  });

  it('falls back to the input default when the user left the value empty', () => {
    const module = buildModule({
      resourceBlocks: [
        {
          resourceType: 'aws_s3_bucket_versioning',
          resourceName: 'this',
          attributes: [{ attribute: 'status', fromInput: 'versioning' }],
        },
      ],
      inputs: [input({ name: 'versioning', default: 'Enabled' })],
    });

    expect(renderMainTf(module, { versioning: '' })).toContain('status = "Enabled"');
    expect(renderMainTf(module, { versioning: 'Suspended' })).toContain('status = "Suspended"');
  });

  it('drops the attributes that resolve to no value at all', () => {
    const tf = renderMainTf(bucketWithUnmappedPrefix, { bucket_name: 'assets' });

    expect(tf).toContain('= "assets"');
    expect(tf).not.toContain('bucket_prefix');
  });

  it('aligns on the widest declared attribute, even when that one gets dropped', () => {
    const tf = renderMainTf(bucketWithUnmappedPrefix, { bucket_name: 'assets' });

    expect(tf).toContain('  bucket        = "assets"');
  });

  it('separates a nested block from the attributes with a blank line', () => {
    const module = buildModule({
      resourceBlocks: [
        {
          resourceType: 'aws_dynamodb_table',
          resourceName: 'this',
          attributes: [{ attribute: 'name', fromInput: 'table_name' }],
          nestedBlocks: [
            {
              blockType: 'attribute',
              attributes: [{ attribute: 'type', fromInput: 'hash_key_type' }],
            },
          ],
        },
      ],
      inputs: [input({ name: 'table_name' }), input({ name: 'hash_key_type' })],
    });

    const tf = renderMainTf(module, { table_name: 'orders', hash_key_type: 'S' });

    expect(tf).toBe(
      [
        'resource "aws_dynamodb_table" "this" {',
        '  name = "orders"',
        '',
        '  attribute {',
        '    type = "S"',
        '  }',
        '}',
        '',
      ].join('\n'),
    );
  });

  it('omits a nested block whose attributes all resolve to no value', () => {
    const module = buildModule({
      resourceBlocks: [
        {
          resourceType: 'aws_cloudfront_distribution',
          resourceName: 'this',
          attributes: [{ attribute: 'enabled', fromInput: 'enabled' }],
          nestedBlocks: [
            {
              blockType: 'logging_config',
              attributes: [{ attribute: 'bucket', fromInput: 'log_bucket' }],
            },
          ],
        },
      ],
      inputs: [input({ name: 'enabled', type: 'bool' }), input({ name: 'log_bucket' })],
    });

    const tf = renderMainTf(module, { enabled: true });

    expect(tf).toBe(
      [
        'resource "aws_cloudfront_distribution" "this" {',
        '  enabled = true',
        '}',
        '',
      ].join('\n'),
    );
  });

  it('separates two resource blocks with a blank line', () => {
    const module = buildModule({
      resourceBlocks: [
        {
          resourceType: 'aws_sqs_queue',
          resourceName: 'this',
          attributes: [{ attribute: 'name', fromInput: 'queue_name' }],
        },
        {
          resourceType: 'aws_sqs_queue_policy',
          resourceName: 'this',
          attributes: [{ attribute: 'queue_url', fromInput: 'queue_url' }],
        },
      ],
      inputs: [input({ name: 'queue_name' }), input({ name: 'queue_url' })],
    });

    const tf = renderMainTf(module, { queue_name: 'jobs', queue_url: 'https://sqs.local/jobs' });

    expect(tf).toContain('}\n\nresource "aws_sqs_queue_policy" "this" {');
  });

  it('formats each value according to the declared input type', () => {
    const module = buildModule({
      resourceBlocks: [
        {
          resourceType: 'aws_lambda_function',
          resourceName: 'this',
          attributes: [
            { attribute: 'memory_size', fromInput: 'memory_size' },
            { attribute: 'publish', fromInput: 'publish' },
            { attribute: 'layers', fromInput: 'layers' },
          ],
        },
      ],
      inputs: [
        input({ name: 'memory_size', type: 'number' }),
        input({ name: 'publish', type: 'bool' }),
        input({ name: 'layers', type: 'list' }),
      ],
    });

    const tf = renderMainTf(module, { memory_size: 256, publish: false, layers: ['arn:layer'] });

    expect(tf).toContain('memory_size = 256');
    expect(tf).toContain('publish     = false');
    expect(tf).toContain('layers      = [\n  "arn:layer"\n]');
  });
});
