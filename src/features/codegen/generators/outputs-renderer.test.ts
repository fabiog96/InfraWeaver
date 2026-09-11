import { describe, expect, it } from 'vitest';

import { renderOutputsTf } from './outputs-renderer';

describe('renderOutputsTf', () => {
  it('returns an empty file when the module declares no output', () => {
    expect(renderOutputsTf([])).toBe('');
  });

  it('renders the terraform expression unquoted', () => {
    const tf = renderOutputsTf([
      {
        name: 'bucket_arn',
        description: 'Bucket ARN',
        terraformExpression: 'aws_s3_bucket.this.arn',
      },
    ]);

    expect(tf).toBe(
      [
        'output "bucket_arn" {',
        '  description = "Bucket ARN"',
        '  value       = aws_s3_bucket.this.arn',
        '}',
        '',
      ].join('\n'),
    );
  });

  it('separates two output blocks with a blank line', () => {
    const tf = renderOutputsTf([
      { name: 'first', description: 'First', terraformExpression: 'aws_s3_bucket.this.arn' },
      { name: 'second', description: 'Second', terraformExpression: 'aws_s3_bucket.this.id' },
    ]);

    expect(tf).toContain('}\n\noutput "second" {');
  });
});
