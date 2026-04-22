import type { TerraformModule } from '../../types';

export const awsDocumentdbModule: TerraformModule = {
  id: 'aws-documentdb',
  category: 'database',
  resourceBlocks: [
    {
      resourceType: 'aws_docdb_cluster',
      resourceName: 'this',
      attributes: [
        { attribute: 'cluster_identifier', fromInput: 'cluster_identifier' },
        { attribute: 'engine', fromInput: 'engine' },
        { attribute: 'master_username', fromInput: 'master_username' },
        { attribute: 'master_password', fromInput: 'master_password' },
        { attribute: 'db_subnet_group_name', fromInput: 'db_subnet_group_name' },
        { attribute: 'skip_final_snapshot', fromInput: 'skip_final_snapshot' },
      ],
    },
  ],
  inputs: [
    { name: 'cluster_identifier', type: 'string', required: true, description: 'DocumentDB cluster identifier' },
    { name: 'engine', type: 'string', default: 'docdb', required: false, description: 'Database engine' },
    { name: 'master_username', type: 'string', default: 'admin', required: false, description: 'Master username' },
    { name: 'db_subnet_group_name', type: 'string', required: false, description: 'DB subnet group name' },
    { name: 'skip_final_snapshot', type: 'bool', default: false, required: false, description: 'Skip final snapshot on deletion' },
  ],
  outputs: [
    { name: 'cluster_arn', description: 'Cluster ARN', terraformExpression: 'aws_docdb_cluster.this.arn' },
    { name: 'cluster_endpoint', description: 'Cluster endpoint', terraformExpression: 'aws_docdb_cluster.this.endpoint' },
    { name: 'reader_endpoint', description: 'Reader endpoint', terraformExpression: 'aws_docdb_cluster.this.reader_endpoint' },
  ],
  secrets: [
    { name: 'master_password', description: 'Master database password', source: 'secretsmanager' },
  ],
  requiredProviders: ['aws'],
  implicitDependencies: ['aws-vpc'],
};
