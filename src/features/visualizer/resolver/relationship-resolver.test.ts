import { describe, expect, it } from 'vitest';

import microservicesTf from '../parser/fixtures/microservices.tf?raw';
import { parseFiles, type FileInput } from '../parser/hcl-parser';
import type { ParsedFile } from '../parser/types';

import edgeCasesTf from './fixtures/edge-cases.tf?raw';
import { resolveRelationships, type ResolveResult } from './relationship-resolver';

const microservicesFile: FileInput = {
  path: 'resources/070-microservices/report-downloader.tf',
  content: microservicesTf,
};

const edgeCasesFile: FileInput = {
  path: 'resources/070-microservices/edge-cases.tf',
  content: edgeCasesTf,
};

const parse = async (file: FileInput): Promise<ParsedFile[]> => {
  const parsed = await parseFiles([file]);
  expect(parsed.errors).toEqual([]);
  return parsed.files;
};

const resolve = async (file: FileInput): Promise<ResolveResult> =>
  resolveRelationships(await parse(file));

const referencesOf = (files: ParsedFile[], address: string): string[] => {
  const block = files
    .flatMap((file) => file.resources)
    .find((resource) => `${resource.resourceType}.${resource.name}` === address);
  if (!block) throw new Error(`no block addressed "${address}" in the fixture`);
  return block.references;
};

const edgePairs = (result: ResolveResult): string[] =>
  result.edges.map((edge) => `${edge.source} → ${edge.target}`);

describe('resolveRelationships — a cross-referenced stack', () => {
  it('turns every resource, data and module block into a node', async () => {
    const { nodes } = await resolve(microservicesFile);

    expect(new Set(nodes.map((node) => node.id))).toEqual(
      new Set([
        'data.aws_ecr_repository.report_downloader_service_repo',
        'data.aws_acm_certificate.wildcard_eu',
        'resource.aws_dynamodb_table.report_downloader',
        'resource.aws_s3_bucket.report_downloads',
        'resource.aws_s3_bucket_lifecycle_configuration.report_downloads_lifecycle',
        'resource.aws_sqs_queue.report_download_jobs_dlq',
        'resource.aws_sqs_queue.report_download_jobs',
        'module.report_downloader_service',
      ]),
    );
  });

  it('draws an edge for every reference that lands on a node', async () => {
    const result = await resolve(microservicesFile);

    expect(new Set(edgePairs(result))).toEqual(
      new Set([
        'resource.aws_s3_bucket_lifecycle_configuration.report_downloads_lifecycle → resource.aws_s3_bucket.report_downloads',
        'resource.aws_sqs_queue.report_download_jobs → resource.aws_sqs_queue.report_download_jobs_dlq',
        'module.report_downloader_service → data.aws_ecr_repository.report_downloader_service_repo',
        'module.report_downloader_service → data.aws_acm_certificate.wildcard_eu',
        'module.report_downloader_service → resource.aws_dynamodb_table.report_downloader',
        'module.report_downloader_service → resource.aws_s3_bucket.report_downloads',
        'module.report_downloader_service → resource.aws_sqs_queue.report_download_jobs',
      ]),
    );
  });

  it('labels an edge with the attribute the reference reads', async () => {
    const { edges } = await resolve(microservicesFile);

    const toDlq = edges.find(
      (edge) => edge.target === 'resource.aws_sqs_queue.report_download_jobs_dlq',
    );
    expect(toDlq).toMatchObject({
      source: 'resource.aws_sqs_queue.report_download_jobs',
      label: 'arn',
      type: 'explicit',
    });
  });

  it('reads the module type and its layer off the source path', async () => {
    const { nodes } = await resolve(microservicesFile);

    const service = nodes.find((node) => node.id === 'module.report_downloader_service');
    expect(service).toMatchObject({
      type: 'module',
      provider: 'aws',
      serviceType: 'api-gateway-lambda',
      moduleSource: 'api-gateway-lambda',
      layer: '070-microservices',
    });
  });

  it('names a resource after its type, stripped of the aws prefix', async () => {
    const { nodes } = await resolve(microservicesFile);

    const table = nodes.find((node) => node.id === 'resource.aws_dynamodb_table.report_downloader');
    expect(table).toMatchObject({
      type: 'resource',
      provider: 'aws',
      serviceType: 'dynamodb table',
      label: 'report_downloader',
    });
  });

  it('ignores variables, outputs and locals', async () => {
    const { nodes } = await resolve({
      path: 'resources/070-microservices/variables.tf',
      content: `
        variable "env" { type = string }
        output "table_arn" { value = aws_dynamodb_table.report_downloader.arn }
        locals { name = "report-downloader" }
      `,
    });

    expect(nodes).toEqual([]);
  });
});

describe('resolveRelationships — edge cases', () => {
  it('drops a reference to a block that does not exist', async () => {
    const files = await parse(edgeCasesFile);
    expect(referencesOf(files, 'aws_lambda_function.notifier')).toContain(
      'aws_sns_topic.alerts.arn',
    );

    const result = resolveRelationships(files);
    expect(edgePairs(result)).not.toContain(
      'resource.aws_lambda_function.notifier → resource.aws_sns_topic.alerts',
    );
    expect(result.nodes.map((node) => node.id)).not.toContain('resource.aws_sns_topic.alerts');
  });

  it('keeps both directions of a circular reference', async () => {
    const result = await resolve(edgeCasesFile);

    expect(edgePairs(result)).toEqual(
      expect.arrayContaining([
        'resource.aws_security_group.api → resource.aws_security_group.worker',
        'resource.aws_security_group.worker → resource.aws_security_group.api',
      ]),
    );
  });

  it('drops a self-reference', async () => {
    const files = await parse(edgeCasesFile);
    expect(referencesOf(files, 'aws_iam_role.notifier')).toContain('aws_iam_role.notifier.arn');

    const { edges } = resolveRelationships(files);
    expect(edges.filter((edge) => edge.source === edge.target)).toEqual([]);
  });

  it('keeps a block with no relationship as an isolated node', async () => {
    const { nodes, edges } = await resolve(edgeCasesFile);

    const standalone = 'resource.aws_cloudwatch_log_group.standalone';
    const touchingStandalone = edges.filter(
      (edge) => edge.source === standalone || edge.target === standalone,
    );

    expect(nodes.map((node) => node.id)).toContain(standalone);
    expect(touchingStandalone).toEqual([]);
  });

  it('draws one edge only when a block reads the same target twice', async () => {
    const files = await parse(edgeCasesFile);
    expect(referencesOf(files, 'aws_s3_bucket_policy.artifacts')).toEqual(
      expect.arrayContaining(['aws_s3_bucket.artifacts.id', 'aws_s3_bucket.artifacts.arn']),
    );

    const toBucket = edgePairs(resolveRelationships(files)).filter(
      (pair) => pair === 'resource.aws_s3_bucket_policy.artifacts → resource.aws_s3_bucket.artifacts',
    );
    expect(toBucket).toHaveLength(1);
  });

  it('never points an edge at a var or a local', async () => {
    const { edges } = await resolve(edgeCasesFile);

    expect(edges.filter((edge) => /^(var|local)\./.test(edge.target))).toEqual([]);
  });

  it('returns an empty graph for no files at all', () => {
    expect(resolveRelationships([])).toEqual({ nodes: [], edges: [], errors: [] });
  });
});
