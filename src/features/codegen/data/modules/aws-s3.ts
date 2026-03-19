import type { TerraformModule } from '../../types';

export const awsS3Module: TerraformModule = {
  id: 'aws-s3',
  category: 'storage',
  resourceBlocks: [
    {
      resourceType: 'aws_s3_bucket',
      resourceName: 'this',
      attributes: [
        { attribute: 'bucket', fromInput: 'bucket_name' },
      ],
    },
    {
      resourceType: 'aws_s3_bucket_versioning',
      resourceName: 'this',
      attributes: [
        { attribute: 'bucket', fromInput: '_bucket_id' },
      ],
      nestedBlocks: [
        {
          blockType: 'versioning_configuration',
          attributes: [
            { attribute: 'status', fromInput: 'versioning' },
          ],
        },
      ],
    },
  ],
  inputs: [
    { name: 'bucket_name', type: 'string', required: true, description: 'S3 bucket name (globally unique)' },
    { name: 'versioning', type: 'string', default: 'Enabled', required: false, description: 'Versioning status (Enabled or Suspended)' },
  ],
  outputs: [
    { name: 'bucket_arn', description: 'Bucket ARN', terraformExpression: 'aws_s3_bucket.this.arn' },
    { name: 'bucket_name', description: 'Bucket name', terraformExpression: 'aws_s3_bucket.this.id' },
    { name: 'bucket_domain_name', description: 'Bucket domain name', terraformExpression: 'aws_s3_bucket.this.bucket_regional_domain_name' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
