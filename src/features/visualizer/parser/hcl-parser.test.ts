import { describe, expect, it } from 'vitest';

import brokenTf from './fixtures/broken.tf?raw';
import localsAndOutputsTf from './fixtures/locals-and-outputs.tf?raw';
import microservicesTf from './fixtures/microservices.tf?raw';
import { parseFiles, type FileInput } from './hcl-parser';
import type { BlockType, ParsedResource } from './types';

const microservicesFile: FileInput = { path: 'microservices.tf', content: microservicesTf };
const localsAndOutputsFile: FileInput = { path: 'locals-and-outputs.tf', content: localsAndOutputsTf };
const brokenFile: FileInput = { path: 'broken.tf', content: brokenTf };

const findBlock = (resources: ParsedResource[], type: BlockType, name: string): ParsedResource => {
  const match = resources.find((r) => r.type === type && r.name === name);
  if (match) return match;

  const available = resources.map((r) => `${r.type}.${r.name}`).join(', ');
  throw new Error(`no ${type} block named "${name}" in [${available}]`);
};

const parseSingle = async (file: FileInput): Promise<ParsedResource[]> => {
  const result = await parseFiles([file]);
  expect(result.errors).toEqual([]);
  return result.files[0].resources;
};

describe('parseFiles — extracted resources', () => {
  it('flattens resource, data and module blocks of a microservices stack', async () => {
    const result = await parseFiles([microservicesFile]);

    expect(result.stats).toEqual({
      totalFiles: 1,
      parsedFiles: 1,
      skippedFiles: 0,
      totalResources: 8,
      totalErrors: 0,
    });

    const resources = result.files[0].resources;
    expect(resources).toHaveLength(8);

    expect(resources.filter((r) => r.type === 'resource').map((r) => `${r.resourceType}.${r.name}`)).toEqual(
      expect.arrayContaining([
        'aws_dynamodb_table.report_downloader',
        'aws_s3_bucket.report_downloads',
        'aws_s3_bucket_lifecycle_configuration.report_downloads_lifecycle',
        'aws_sqs_queue.report_download_jobs',
        'aws_sqs_queue.report_download_jobs_dlq',
      ]),
    );

    expect(resources.filter((r) => r.type === 'data').map((r) => `${r.resourceType}.${r.name}`)).toEqual(
      expect.arrayContaining([
        'aws_ecr_repository.report_downloader_service_repo',
        'aws_acm_certificate.wildcard_eu',
      ]),
    );

    expect(findBlock(resources, 'module', 'report_downloader_service').source).toBe(
      './../../../../utils/modules/api-gateway-lambda',
    );
  });

  it('flattens locals, variable and output blocks', async () => {
    const resources = await parseSingle(localsAndOutputsFile);
    expect(resources).toHaveLength(5);

    expect(resources.filter((r) => r.type === 'variable').map((r) => r.name)).toEqual(
      expect.arrayContaining(['env', 'report_downloader_topic_arn']),
    );
    expect(resources.filter((r) => r.type === 'output').map((r) => r.name)).toEqual(
      expect.arrayContaining(['report_downloader_table_arn', 'workspace_cognito_user_pool_id']),
    );

    const locals = findBlock(resources, 'locals', 'locals');
    expect(locals.attributes).toMatchObject({ report_downloader_name: 'report-downloader-service' });
  });

  it('keeps each block attributes and its source line range', async () => {
    const resources = await parseSingle(microservicesFile);
    const table = findBlock(resources, 'resource', 'report_downloader');

    expect(table.attributes).toMatchObject({ billing_mode: 'PAY_PER_REQUEST', hash_key: 'pk' });
    expect(table.filePath).toBe('microservices.tf');
    expect(table.lineStart).toBeGreaterThan(0);
    expect(table.lineEnd).toBeGreaterThan(table.lineStart);
    const declarationLine = microservicesFile.content.split('\n')[table.lineStart - 1];
    expect(declarationLine).toContain('"aws_dynamodb_table" "report_downloader"');
  });
});

describe('parseFiles — references between resources', () => {
  it('collects the resources, data sources and locals a module wires together', async () => {
    const resources = await parseSingle(microservicesFile);

    expect(findBlock(resources, 'module', 'report_downloader_service').references).toEqual(
      expect.arrayContaining([
        'var.env',
        'aws_dynamodb_table.report_downloader.arn',
        'aws_dynamodb_table.report_downloader.name',
        'aws_sqs_queue.report_download_jobs.url',
        'aws_cognito_user_pool.workspace.id',
        'data.aws_ecr_repository.report_downloader_service_repo.repository_url',
        'local.report_downloads_domain_name',
        'local.report_downloader_common_tags',
      ]),
    );
  });

  it('sees through jsonencode into a redrive policy', async () => {
    const resources = await parseSingle(microservicesFile);

    expect(findBlock(resources, 'resource', 'report_download_jobs').references).toContain(
      'aws_sqs_queue.report_download_jobs_dlq.arn',
    );
  });

  it('does not yet see aws_s3_bucket references — known bug, see #44', async () => {
    const resources = await parseSingle(microservicesFile);

    expect(findBlock(resources, 'module', 'report_downloader_service').references).not.toContain(
      'aws_s3_bucket.report_downloads.bucket',
    );
    expect(findBlock(resources, 'resource', 'report_downloads_lifecycle').references).toEqual([]);
  });

  it('extracts the operands of a merge(), never the call itself', async () => {
    const resources = await parseSingle(microservicesFile);
    const table = findBlock(resources, 'resource', 'report_downloader');

    expect(new Set(table.references)).toEqual(
      new Set(['var.env', 'local.report_downloader_common_tags']),
    );
  });

  it('collects references nested inside a locals block', async () => {
    const resources = await parseSingle(localsAndOutputsFile);

    expect(findBlock(resources, 'locals', 'locals').references).toEqual(
      expect.arrayContaining([
        'var.env',
        'local.cognito_domain',
        'aws_cognito_user_pool.workspace.id',
        'aws_cognito_user_pool_client.web_client.id',
        'aws_cognito_user_pool_domain.workspace_pool_domain.domain',
      ]),
    );
  });
});

describe('parseFiles — a file that does not parse', () => {
  it('skips it and reports a parse error instead of throwing', async () => {
    const result = await parseFiles([brokenFile]);

    expect(result.files).toEqual([]);
    expect(result.stats).toMatchObject({ parsedFiles: 0, skippedFiles: 1, totalResources: 0 });
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toMatchObject({ level: 'parse_error', filePath: 'broken.tf' });
  });

  it('does not stop the other files from being parsed', async () => {
    const result = await parseFiles([brokenFile, microservicesFile, localsAndOutputsFile]);

    expect(result.files.map((f) => f.path)).toEqual(['microservices.tf', 'locals-and-outputs.tf']);
    expect(result.stats).toMatchObject({ totalFiles: 3, parsedFiles: 2, skippedFiles: 1 });
    expect(result.stats.totalResources).toBeGreaterThan(0);
  });

  it('reports an empty file without invoking the parser', async () => {
    const result = await parseFiles([{ path: 'empty.tf', content: '   \n\n' }]);

    expect(result.files).toEqual([]);
    expect(result.errors).toEqual([
      { level: 'file_error', filePath: 'empty.tf', message: 'File is empty.' },
    ]);
  });
});
