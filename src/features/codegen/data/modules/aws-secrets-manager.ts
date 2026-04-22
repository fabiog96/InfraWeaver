import type { TerraformModule } from '../../types';

export const awsSecretsManagerModule: TerraformModule = {
  id: 'aws-secrets-manager',
  category: 'security',
  resourceBlocks: [
    {
      resourceType: 'aws_secretsmanager_secret',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'secret_name' },
        { attribute: 'description', fromInput: 'description' },
        { attribute: 'recovery_window_in_days', fromInput: 'recovery_window_days' },
        { attribute: 'kms_key_id', fromInput: 'kms_key_id' },
      ],
    },
  ],
  inputs: [
    { name: 'secret_name', type: 'string', required: true, description: 'Secret name' },
    { name: 'description', type: 'string', required: false, description: 'Secret description' },
    { name: 'recovery_window_days', type: 'number', default: 30, required: false, description: 'Recovery window in days (0 for immediate deletion)' },
    { name: 'kms_key_id', type: 'string', required: false, description: 'KMS key ID for encryption' },
  ],
  outputs: [
    { name: 'secret_arn', description: 'Secret ARN', terraformExpression: 'aws_secretsmanager_secret.this.arn' },
    { name: 'secret_id', description: 'Secret ID', terraformExpression: 'aws_secretsmanager_secret.this.id' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
