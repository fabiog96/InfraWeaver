import type { TerraformModule } from '../../types';

export const awsCodepipelineModule: TerraformModule = {
  id: 'aws-codepipeline',
  category: 'devtools',
  resourceBlocks: [
    {
      resourceType: 'aws_codepipeline',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'pipeline_name' },
        { attribute: 'role_arn', fromInput: 'role_arn' },
        { attribute: 'pipeline_type', fromInput: 'pipeline_type' },
      ],
      nestedBlocks: [
        {
          blockType: 'artifact_store',
          attributes: [
            { attribute: 'location', fromInput: 'artifact_bucket' },
            { attribute: 'type', fromInput: '_artifact_store_type' },
          ],
        },
      ],
    },
  ],
  inputs: [
    { name: 'pipeline_name', type: 'string', required: true, description: 'Pipeline name' },
    { name: 'role_arn', type: 'string', required: true, description: 'IAM service role ARN' },
    { name: 'pipeline_type', type: 'string', default: 'V2', required: false, description: 'Pipeline type', options: ['V1', 'V2'] },
    { name: 'artifact_bucket', type: 'string', required: true, description: 'S3 bucket for artifacts' },
  ],
  outputs: [
    { name: 'pipeline_arn', description: 'Pipeline ARN', terraformExpression: 'aws_codepipeline.this.arn' },
    { name: 'pipeline_id', description: 'Pipeline ID', terraformExpression: 'aws_codepipeline.this.id' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
  implicitDependencies: ['aws-s3', 'aws-iam'],
};
