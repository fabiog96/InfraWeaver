import type { TerraformModule } from '../../types';

export const awsAthenaModule: TerraformModule = {
  id: 'aws-athena',
  category: 'analytics',
  resourceBlocks: [
    {
      resourceType: 'aws_athena_workgroup',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'workgroup_name' },
        { attribute: 'state', fromInput: 'state' },
        { attribute: 'force_destroy', fromInput: 'force_destroy' },
      ],
      nestedBlocks: [
        {
          blockType: 'configuration',
          attributes: [
            { attribute: 'enforce_workgroup_configuration', fromInput: 'enforce_configuration' },
          ],
        },
      ],
    },
  ],
  inputs: [
    { name: 'workgroup_name', type: 'string', required: true, description: 'Athena workgroup name' },
    { name: 'state', type: 'string', default: 'ENABLED', required: false, description: 'Workgroup state', options: ['ENABLED', 'DISABLED'] },
    { name: 'force_destroy', type: 'bool', default: false, required: false, description: 'Force destroy named queries' },
    { name: 'enforce_configuration', type: 'bool', default: true, required: false, description: 'Enforce workgroup configuration on queries' },
  ],
  outputs: [
    { name: 'workgroup_arn', description: 'Workgroup ARN', terraformExpression: 'aws_athena_workgroup.this.arn' },
    { name: 'workgroup_id', description: 'Workgroup ID', terraformExpression: 'aws_athena_workgroup.this.id' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
  implicitDependencies: ['aws-s3'],
};
