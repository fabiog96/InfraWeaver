import type { TerraformModule } from '../../types';

export const awsGlacierModule: TerraformModule = {
  id: 'aws-glacier',
  category: 'storage',
  resourceBlocks: [
    {
      resourceType: 'aws_glacier_vault',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'vault_name' },
      ],
    },
  ],
  inputs: [
    { name: 'vault_name', type: 'string', required: true, description: 'Glacier vault name' },
  ],
  outputs: [
    { name: 'vault_arn', description: 'Vault ARN', terraformExpression: 'aws_glacier_vault.this.arn' },
    { name: 'vault_name', description: 'Vault name', terraformExpression: 'aws_glacier_vault.this.name' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
