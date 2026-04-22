import type { TerraformModule } from '../../types';

export const awsBedrockModule: TerraformModule = {
  id: 'aws-bedrock',
  category: 'ml',
  resourceBlocks: [
    {
      resourceType: 'aws_bedrock_custom_model',
      resourceName: 'this',
      attributes: [
        { attribute: 'custom_model_name', fromInput: 'model_name' },
        { attribute: 'role_arn', fromInput: 'role_arn' },
        { attribute: 'base_model_identifier', fromInput: 'base_model_id' },
        { attribute: 'job_name', fromInput: 'job_name' },
        { attribute: 'customization_type', fromInput: 'customization_type' },
      ],
      nestedBlocks: [
        {
          blockType: 'output_data_config',
          attributes: [
            { attribute: 's3_uri', fromInput: 'output_s3_uri' },
          ],
        },
        {
          blockType: 'training_data_config',
          attributes: [
            { attribute: 's3_uri', fromInput: 'training_s3_uri' },
          ],
        },
      ],
    },
  ],
  inputs: [
    { name: 'model_name', type: 'string', required: true, description: 'Custom model name' },
    { name: 'role_arn', type: 'string', required: true, description: 'IAM role ARN for Bedrock' },
    { name: 'base_model_id', type: 'string', required: true, description: 'Base model identifier' },
    { name: 'job_name', type: 'string', required: true, description: 'Customization job name' },
    { name: 'customization_type', type: 'string', default: 'FINE_TUNING', required: false, description: 'Customization type', options: ['FINE_TUNING', 'CONTINUED_PRE_TRAINING'] },
    { name: 'output_s3_uri', type: 'string', required: true, description: 'S3 URI for output data' },
    { name: 'training_s3_uri', type: 'string', required: true, description: 'S3 URI for training data' },
  ],
  outputs: [
    { name: 'model_arn', description: 'Custom model ARN', terraformExpression: 'aws_bedrock_custom_model.this.custom_model_arn' },
    { name: 'job_arn', description: 'Job ARN', terraformExpression: 'aws_bedrock_custom_model.this.job_arn' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
  implicitDependencies: ['aws-s3', 'aws-iam'],
};
