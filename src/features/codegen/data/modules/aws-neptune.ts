import type { TerraformModule } from '../../types';

export const awsNeptuneModule: TerraformModule = {
  id: 'aws-neptune',
  category: 'database',
  resourceBlocks: [
    {
      resourceType: 'aws_neptune_cluster',
      resourceName: 'this',
      attributes: [
        { attribute: 'cluster_identifier', fromInput: 'cluster_identifier' },
        { attribute: 'engine', fromInput: 'engine' },
        { attribute: 'engine_version', fromInput: 'engine_version' },
        { attribute: 'neptune_subnet_group_name', fromInput: 'subnet_group_name' },
        { attribute: 'skip_final_snapshot', fromInput: 'skip_final_snapshot' },
      ],
    },
  ],
  inputs: [
    { name: 'cluster_identifier', type: 'string', required: true, description: 'Neptune cluster identifier' },
    { name: 'engine', type: 'string', default: 'neptune', required: false, description: 'Database engine' },
    { name: 'engine_version', type: 'string', default: '1.3.1.0', required: false, description: 'Engine version' },
    { name: 'subnet_group_name', type: 'string', required: false, description: 'Subnet group name' },
    { name: 'skip_final_snapshot', type: 'bool', default: false, required: false, description: 'Skip final snapshot on deletion' },
  ],
  outputs: [
    { name: 'cluster_arn', description: 'Cluster ARN', terraformExpression: 'aws_neptune_cluster.this.arn' },
    { name: 'cluster_endpoint', description: 'Cluster endpoint', terraformExpression: 'aws_neptune_cluster.this.endpoint' },
    { name: 'reader_endpoint', description: 'Reader endpoint', terraformExpression: 'aws_neptune_cluster.this.reader_endpoint' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
  implicitDependencies: ['aws-vpc'],
};
