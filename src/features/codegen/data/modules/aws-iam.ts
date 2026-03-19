import type { TerraformModule } from '../../types';

export const awsIamModule: TerraformModule = {
  id: 'aws-iam',
  category: 'security',
  resourceBlocks: [
    {
      resourceType: 'aws_iam_role',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'role_name' },
        { attribute: 'assume_role_policy', fromInput: 'assume_role_policy' },
      ],
    },
  ],
  inputs: [
    { name: 'role_name', type: 'string', required: true, description: 'IAM role name' },
    { name: 'assume_role_policy', type: 'string', required: false, description: 'Assume role policy JSON' },
  ],
  outputs: [
    { name: 'role_arn', description: 'Role ARN', terraformExpression: 'aws_iam_role.this.arn' },
    { name: 'role_name', description: 'Role name', terraformExpression: 'aws_iam_role.this.name' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
