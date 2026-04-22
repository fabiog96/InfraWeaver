import type { TerraformModule } from '../../types';

export const awsBackupModule: TerraformModule = {
  id: 'aws-backup',
  category: 'storage',
  resourceBlocks: [
    {
      resourceType: 'aws_backup_vault',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'vault_name' },
        { attribute: 'kms_key_arn', fromInput: 'kms_key_arn' },
      ],
    },
    {
      resourceType: 'aws_backup_plan',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'plan_name' },
      ],
      nestedBlocks: [
        {
          blockType: 'rule',
          attributes: [
            { attribute: 'rule_name', fromInput: 'rule_name' },
            { attribute: 'target_vault_name', fromInput: '_vault_name' },
            { attribute: 'schedule', fromInput: 'schedule' },
          ],
        },
      ],
    },
  ],
  inputs: [
    { name: 'vault_name', type: 'string', required: true, description: 'Backup vault name' },
    { name: 'plan_name', type: 'string', required: true, description: 'Backup plan name' },
    { name: 'rule_name', type: 'string', default: 'daily-backup', required: false, description: 'Backup rule name' },
    { name: 'schedule', type: 'string', default: 'cron(0 3 * * ? *)', required: false, description: 'Backup schedule (cron expression)' },
    { name: 'kms_key_arn', type: 'string', required: false, description: 'KMS key ARN for encryption' },
  ],
  outputs: [
    { name: 'vault_arn', description: 'Vault ARN', terraformExpression: 'aws_backup_vault.this.arn' },
    { name: 'plan_arn', description: 'Plan ARN', terraformExpression: 'aws_backup_plan.this.arn' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
