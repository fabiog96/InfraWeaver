import type { TerraformModule } from '../../types';

export const awsBatchModule: TerraformModule = {
  id: 'aws-batch',
  category: 'compute',
  resourceBlocks: [
    {
      resourceType: 'aws_batch_compute_environment',
      resourceName: 'this',
      attributes: [
        { attribute: 'compute_environment_name', fromInput: 'environment_name' },
        { attribute: 'type', fromInput: 'compute_type' },
        { attribute: 'state', fromInput: 'state' },
        { attribute: 'service_role', fromInput: 'service_role_arn' },
      ],
      nestedBlocks: [
        {
          blockType: 'compute_resources',
          attributes: [
            { attribute: 'type', fromInput: 'resource_type' },
            { attribute: 'max_vcpus', fromInput: 'max_vcpus' },
            { attribute: 'min_vcpus', fromInput: 'min_vcpus' },
            { attribute: 'subnets', fromInput: 'subnet_ids' },
            { attribute: 'security_group_ids', fromInput: 'security_group_ids' },
          ],
        },
      ],
    },
  ],
  inputs: [
    { name: 'environment_name', type: 'string', required: true, description: 'Compute environment name' },
    { name: 'compute_type', type: 'string', default: 'MANAGED', required: false, description: 'Compute environment type', options: ['MANAGED', 'UNMANAGED'] },
    { name: 'state', type: 'string', default: 'ENABLED', required: false, description: 'State of the environment', options: ['ENABLED', 'DISABLED'] },
    { name: 'service_role_arn', type: 'string', required: false, description: 'IAM service role ARN' },
    { name: 'resource_type', type: 'string', default: 'FARGATE', required: false, description: 'Compute resource type', options: ['EC2', 'SPOT', 'FARGATE', 'FARGATE_SPOT'] },
    { name: 'max_vcpus', type: 'number', default: 16, required: false, description: 'Maximum vCPUs' },
    { name: 'min_vcpus', type: 'number', default: 0, required: false, description: 'Minimum vCPUs' },
    { name: 'subnet_ids', type: 'list', required: false, description: 'Subnet IDs' },
    { name: 'security_group_ids', type: 'list', required: false, description: 'Security group IDs' },
  ],
  outputs: [
    { name: 'compute_environment_arn', description: 'Compute environment ARN', terraformExpression: 'aws_batch_compute_environment.this.arn' },
    { name: 'ecs_cluster_arn', description: 'ECS cluster ARN', terraformExpression: 'aws_batch_compute_environment.this.ecs_cluster_arn' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
  implicitDependencies: ['aws-vpc'],
};
