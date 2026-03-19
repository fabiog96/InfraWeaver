import type { TerraformModule } from '../../types';

export const awsCognitoModule: TerraformModule = {
  id: 'aws-cognito',
  category: 'security',
  resourceBlocks: [
    {
      resourceType: 'aws_cognito_user_pool',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'pool_name' },
        { attribute: 'auto_verified_attributes', fromInput: 'auto_verified_attributes' },
      ],
    },
  ],
  inputs: [
    { name: 'pool_name', type: 'string', required: true, description: 'User pool name' },
    { name: 'auto_verified_attributes', type: 'list', default: ['email'], required: false, description: 'Auto-verified attributes' },
  ],
  outputs: [
    { name: 'user_pool_id', description: 'User pool ID', terraformExpression: 'aws_cognito_user_pool.this.id' },
    { name: 'user_pool_arn', description: 'User pool ARN', terraformExpression: 'aws_cognito_user_pool.this.arn' },
    { name: 'endpoint', description: 'User pool endpoint', terraformExpression: 'aws_cognito_user_pool.this.endpoint' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
