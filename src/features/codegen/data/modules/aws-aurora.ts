import type { TerraformModule } from '../../types';

export const awsAuroraModule: TerraformModule = {
  id: 'aws-aurora',
  category: 'database',
  resourceBlocks: [
    {
      resourceType: 'aws_rds_cluster',
      resourceName: 'this',
      attributes: [
        { attribute: 'cluster_identifier', fromInput: 'cluster_identifier' },
        { attribute: 'engine', fromInput: 'engine' },
        { attribute: 'engine_version', fromInput: 'engine_version' },
        { attribute: 'master_username', fromInput: 'master_username' },
        { attribute: 'master_password', fromInput: 'master_password' },
        { attribute: 'database_name', fromInput: 'database_name' },
        { attribute: 'db_subnet_group_name', fromInput: 'db_subnet_group_name' },
        { attribute: 'skip_final_snapshot', fromInput: 'skip_final_snapshot' },
      ],
    },
    {
      resourceType: 'aws_rds_cluster_instance',
      resourceName: 'this',
      attributes: [
        { attribute: 'identifier', fromInput: '_instance_identifier' },
        { attribute: 'cluster_identifier', fromInput: '_cluster_identifier' },
        { attribute: 'instance_class', fromInput: 'instance_class' },
        { attribute: 'engine', fromInput: 'engine' },
      ],
    },
  ],
  inputs: [
    { name: 'cluster_identifier', type: 'string', required: true, description: 'Aurora cluster identifier' },
    { name: 'engine', type: 'string', default: 'aurora-postgresql', required: false, description: 'Database engine', options: ['aurora-postgresql', 'aurora-mysql'] },
    { name: 'engine_version', type: 'string', required: false, description: 'Engine version' },
    { name: 'master_username', type: 'string', default: 'admin', required: false, description: 'Master username' },
    { name: 'database_name', type: 'string', required: false, description: 'Default database name' },
    { name: 'instance_class', type: 'string', default: 'db.r6g.large', required: false, description: 'Instance class', options: ['db.r6g.large', 'db.r6g.xlarge', 'db.r6g.2xlarge', 'db.r7g.large', 'db.r7g.xlarge', 'db.serverless'] },
    { name: 'db_subnet_group_name', type: 'string', required: false, description: 'DB subnet group name' },
    { name: 'skip_final_snapshot', type: 'bool', default: false, required: false, description: 'Skip final snapshot on deletion' },
  ],
  outputs: [
    { name: 'cluster_arn', description: 'Cluster ARN', terraformExpression: 'aws_rds_cluster.this.arn' },
    { name: 'cluster_endpoint', description: 'Cluster endpoint', terraformExpression: 'aws_rds_cluster.this.endpoint' },
    { name: 'reader_endpoint', description: 'Reader endpoint', terraformExpression: 'aws_rds_cluster.this.reader_endpoint' },
  ],
  secrets: [
    { name: 'master_password', description: 'Master database password', source: 'secretsmanager' },
  ],
  requiredProviders: ['aws'],
  implicitDependencies: ['aws-vpc'],
};
