import type { TerraformModule } from '../../types';

export const awsKmsModule: TerraformModule = {
  id: 'aws-kms',
  category: 'security',
  resourceBlocks: [
    {
      resourceType: 'aws_kms_key',
      resourceName: 'this',
      attributes: [
        { attribute: 'description', fromInput: 'description' },
        { attribute: 'deletion_window_in_days', fromInput: 'deletion_window_days' },
        { attribute: 'enable_key_rotation', fromInput: 'enable_key_rotation' },
        { attribute: 'key_usage', fromInput: 'key_usage' },
      ],
    },
    {
      resourceType: 'aws_kms_alias',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'alias_name' },
        { attribute: 'target_key_id', fromInput: '_key_id' },
      ],
    },
  ],
  inputs: [
    { name: 'description', type: 'string', required: false, description: 'Key description' },
    { name: 'alias_name', type: 'string', required: true, description: 'Key alias (prefix with alias/)' },
    { name: 'deletion_window_days', type: 'number', default: 30, required: false, description: 'Deletion window in days (7-30)' },
    { name: 'enable_key_rotation', type: 'bool', default: true, required: false, description: 'Enable automatic key rotation' },
    { name: 'key_usage', type: 'string', default: 'ENCRYPT_DECRYPT', required: false, description: 'Key usage', options: ['ENCRYPT_DECRYPT', 'SIGN_VERIFY', 'GENERATE_VERIFY_MAC'] },
  ],
  outputs: [
    { name: 'key_id', description: 'KMS key ID', terraformExpression: 'aws_kms_key.this.key_id' },
    { name: 'key_arn', description: 'KMS key ARN', terraformExpression: 'aws_kms_key.this.arn' },
    { name: 'alias_arn', description: 'Alias ARN', terraformExpression: 'aws_kms_alias.this.arn' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
