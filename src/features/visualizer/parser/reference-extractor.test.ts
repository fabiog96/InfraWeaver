import { describe, expect, it } from 'vitest';

import { extractReferences } from './reference-extractor';

describe('extractReferences — resource types containing a digit', () => {
  it.each([
    ['aws_s3_bucket.media.bucket'],
    ['aws_route53_record.api.fqdn'],
    ['aws_ec2_transit_gateway.main.id'],
  ])('reads %s inside an interpolation', (reference) => {
    expect(extractReferences(`\${${reference}}`)).toEqual([reference]);
  });

  it.each([
    ['aws_s3_bucket.media.id'],
    ['aws_route53_record.api.name'],
    ['aws_ec2_transit_gateway.main.arn'],
  ])('reads %s written bare', (reference) => {
    expect(extractReferences(reference)).toEqual([reference]);
  });

  it('reads a digitless type just the same', () => {
    expect(extractReferences('${aws_dynamodb_table.jobs.arn}')).toEqual([
      'aws_dynamodb_table.jobs.arn',
    ]);
  });

  it('reads them through the other providers too', () => {
    expect(extractReferences('${google_compute_backend_service.api.id}')).toEqual([
      'google_compute_backend_service.api.id',
    ]);
    expect(extractReferences('${azurerm_mssql_database.reports.id}')).toEqual([
      'azurerm_mssql_database.reports.id',
    ]);
  });

  it('reads them from nested attribute values', () => {
    expect(
      new Set(
        extractReferences({
          bucket: '${aws_s3_bucket.media.bucket}',
          records: ['${aws_route53_record.api.fqdn}'],
          tags: '${merge(local.common_tags, { env = var.env })}',
        }),
      ),
    ).toEqual(
      new Set([
        'aws_s3_bucket.media.bucket',
        'aws_route53_record.api.fqdn',
        'local.common_tags',
        'var.env',
      ]),
    );
  });
});
