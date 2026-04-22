import type { TerraformModule } from '../../types';

export const awsFargateModule: TerraformModule = {
  id: 'aws-fargate',
  category: 'compute',
  resourceBlocks: [
    {
      resourceType: 'aws_ecs_service',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'service_name' },
        { attribute: 'cluster', fromInput: 'cluster_arn' },
        { attribute: 'task_definition', fromInput: 'task_definition_arn' },
        { attribute: 'desired_count', fromInput: 'desired_count' },
        { attribute: 'launch_type', fromInput: '_launch_type' },
      ],
      nestedBlocks: [
        {
          blockType: 'network_configuration',
          attributes: [
            { attribute: 'subnets', fromInput: 'subnet_ids' },
            { attribute: 'security_groups', fromInput: 'security_group_ids' },
            { attribute: 'assign_public_ip', fromInput: 'assign_public_ip' },
          ],
        },
      ],
    },
  ],
  inputs: [
    { name: 'service_name', type: 'string', required: true, description: 'Fargate service name' },
    { name: 'cluster_arn', type: 'string', required: true, description: 'ECS cluster ARN' },
    { name: 'task_definition_arn', type: 'string', required: true, description: 'Task definition ARN' },
    { name: 'desired_count', type: 'number', default: 1, required: false, description: 'Number of desired tasks' },
    { name: 'subnet_ids', type: 'list', required: false, description: 'Subnet IDs for network configuration' },
    { name: 'security_group_ids', type: 'list', required: false, description: 'Security group IDs' },
    { name: 'assign_public_ip', type: 'bool', default: false, required: false, description: 'Assign public IP to tasks' },
  ],
  outputs: [
    { name: 'service_id', description: 'Service ID', terraformExpression: 'aws_ecs_service.this.id' },
    { name: 'service_name', description: 'Service name', terraformExpression: 'aws_ecs_service.this.name' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
  implicitDependencies: ['aws-ecs', 'aws-vpc'],
};
