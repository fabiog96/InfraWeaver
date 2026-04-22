import type { TerraformModule } from '../../types';

export const awsCloudwatchModule: TerraformModule = {
  id: 'aws-cloudwatch',
  category: 'monitoring',
  resourceBlocks: [
    {
      resourceType: 'aws_cloudwatch_log_group',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'log_group_name' },
        { attribute: 'retention_in_days', fromInput: 'retention_days' },
        { attribute: 'kms_key_id', fromInput: 'kms_key_id' },
      ],
    },
  ],
  inputs: [
    { name: 'log_group_name', type: 'string', required: true, description: 'CloudWatch log group name' },
    { name: 'retention_days', type: 'number', default: 30, required: false, description: 'Log retention in days', options: ['1', '3', '5', '7', '14', '30', '60', '90', '120', '150', '180', '365', '400', '545', '731', '1096', '1827', '2192', '2557', '2922', '3288', '3653'] },
    { name: 'kms_key_id', type: 'string', required: false, description: 'KMS key ARN for encryption' },
  ],
  outputs: [
    { name: 'log_group_arn', description: 'Log group ARN', terraformExpression: 'aws_cloudwatch_log_group.this.arn' },
    { name: 'log_group_name', description: 'Log group name', terraformExpression: 'aws_cloudwatch_log_group.this.name' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
