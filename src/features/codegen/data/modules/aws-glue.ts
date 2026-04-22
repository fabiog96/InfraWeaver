import type { TerraformModule } from '../../types';

export const awsGlueModule: TerraformModule = {
  id: 'aws-glue',
  category: 'analytics',
  resourceBlocks: [
    {
      resourceType: 'aws_glue_catalog_database',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'database_name' },
        { attribute: 'description', fromInput: 'description' },
      ],
    },
    {
      resourceType: 'aws_glue_crawler',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'crawler_name' },
        { attribute: 'database_name', fromInput: '_database_name' },
        { attribute: 'role', fromInput: 'role_arn' },
      ],
      nestedBlocks: [
        {
          blockType: 's3_target',
          attributes: [
            { attribute: 'path', fromInput: 's3_target_path' },
          ],
        },
      ],
    },
  ],
  inputs: [
    { name: 'database_name', type: 'string', required: true, description: 'Glue catalog database name' },
    { name: 'description', type: 'string', required: false, description: 'Database description' },
    { name: 'crawler_name', type: 'string', required: false, description: 'Glue crawler name' },
    { name: 'role_arn', type: 'string', required: false, description: 'IAM role ARN for the crawler' },
    { name: 's3_target_path', type: 'string', required: false, description: 'S3 path for crawler target' },
  ],
  outputs: [
    { name: 'database_name', description: 'Database name', terraformExpression: 'aws_glue_catalog_database.this.name' },
    { name: 'database_arn', description: 'Database ARN', terraformExpression: 'aws_glue_catalog_database.this.arn' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
  implicitDependencies: ['aws-s3', 'aws-iam'],
};
