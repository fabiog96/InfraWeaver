import type { TerraformModule } from '../../types';

export const awsRedshiftModule: TerraformModule = {
  id: 'aws-redshift',
  category: 'database',
  resourceBlocks: [
    {
      resourceType: 'aws_redshift_cluster',
      resourceName: 'this',
      attributes: [
        { attribute: 'cluster_identifier', fromInput: 'cluster_identifier' },
        { attribute: 'database_name', fromInput: 'database_name' },
        { attribute: 'master_username', fromInput: 'master_username' },
        { attribute: 'master_password', fromInput: 'master_password' },
        { attribute: 'node_type', fromInput: 'node_type' },
        { attribute: 'cluster_type', fromInput: 'cluster_type' },
        { attribute: 'number_of_nodes', fromInput: 'number_of_nodes' },
        { attribute: 'skip_final_snapshot', fromInput: 'skip_final_snapshot' },
      ],
    },
  ],
  inputs: [
    { name: 'cluster_identifier', type: 'string', required: true, description: 'Redshift cluster identifier' },
    { name: 'database_name', type: 'string', default: 'dev', required: false, description: 'Default database name' },
    { name: 'master_username', type: 'string', default: 'admin', required: false, description: 'Master username' },
    { name: 'node_type', type: 'string', default: 'ra3.xlplus', required: false, description: 'Node type', options: ['ra3.xlplus', 'ra3.4xlarge', 'ra3.16xlarge', 'dc2.large', 'dc2.8xlarge'] },
    { name: 'cluster_type', type: 'string', default: 'single-node', required: false, description: 'Cluster type', options: ['single-node', 'multi-node'] },
    { name: 'number_of_nodes', type: 'number', default: 1, required: false, description: 'Number of nodes (for multi-node)' },
    { name: 'skip_final_snapshot', type: 'bool', default: false, required: false, description: 'Skip final snapshot on deletion' },
  ],
  outputs: [
    { name: 'cluster_arn', description: 'Cluster ARN', terraformExpression: 'aws_redshift_cluster.this.arn' },
    { name: 'cluster_endpoint', description: 'Cluster endpoint', terraformExpression: 'aws_redshift_cluster.this.endpoint' },
    { name: 'cluster_identifier', description: 'Cluster identifier', terraformExpression: 'aws_redshift_cluster.this.cluster_identifier' },
  ],
  secrets: [
    { name: 'master_password', description: 'Master database password', source: 'secretsmanager' },
  ],
  requiredProviders: ['aws'],
  implicitDependencies: ['aws-vpc'],
};
