import type { TerraformModule } from '../../types';

export const awsEcsModule: TerraformModule = {
  id: 'aws-ecs',
  category: 'containers',
  resourceBlocks: [
    {
      resourceType: 'aws_ecs_cluster',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'cluster_name' },
      ],
    },
  ],
  inputs: [
    { name: 'cluster_name', type: 'string', required: true, description: 'ECS cluster name' },
    { name: 'capacity_providers', type: 'list', default: ['FARGATE'], required: false, description: 'Capacity providers' },
  ],
  outputs: [
    { name: 'cluster_arn', description: 'ECS cluster ARN', terraformExpression: 'aws_ecs_cluster.this.arn' },
    { name: 'cluster_name', description: 'Cluster name', terraformExpression: 'aws_ecs_cluster.this.name' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
  implicitDependencies: ['aws-vpc'],
};
