import type { TerraformModule } from '../../types';

export const awsRdsModule: TerraformModule = {
  id: 'aws-rds',
  category: 'database',
  resourceBlocks: [
    {
      resourceType: 'aws_db_instance',
      resourceName: 'this',
      attributes: [
        { attribute: 'identifier', fromInput: 'identifier' },
        { attribute: 'engine', fromInput: 'engine' },
        { attribute: 'engine_version', fromInput: 'engine_version' },
        { attribute: 'instance_class', fromInput: 'instance_class' },
        { attribute: 'allocated_storage', fromInput: 'allocated_storage' },
        { attribute: 'db_name', fromInput: 'db_name' },
        { attribute: 'username', fromInput: 'username' },
        { attribute: 'password', fromInput: 'password' },
        { attribute: 'skip_final_snapshot', fromInput: 'skip_final_snapshot' },
      ],
    },
  ],
  inputs: [
    { name: 'identifier', type: 'string', required: true, description: 'RDS instance identifier' },
    { name: 'engine', type: 'string', default: 'postgres', required: false, description: 'Database engine', options: ['postgres', 'mysql', 'mariadb', 'oracle-ee', 'oracle-se2', 'sqlserver-ee', 'sqlserver-se', 'sqlserver-ex', 'sqlserver-web'] },
    { name: 'engine_version', type: 'string', default: '16.3', required: false, description: 'Engine version' },
    { name: 'instance_class', type: 'string', default: 'db.t4g.micro', required: false, description: 'Instance class', options: [
      'db.t4g.micro', 'db.t4g.small', 'db.t4g.medium', 'db.t4g.large', 'db.t4g.xlarge', 'db.t4g.2xlarge',
      'db.t3.micro', 'db.t3.small', 'db.t3.medium', 'db.t3.large', 'db.t3.xlarge', 'db.t3.2xlarge',
      'db.r7g.large', 'db.r7g.xlarge', 'db.r7g.2xlarge', 'db.r7g.4xlarge', 'db.r7g.8xlarge',
      'db.r6g.large', 'db.r6g.xlarge', 'db.r6g.2xlarge', 'db.r6g.4xlarge', 'db.r6g.8xlarge',
      'db.r6i.large', 'db.r6i.xlarge', 'db.r6i.2xlarge', 'db.r6i.4xlarge', 'db.r6i.8xlarge',
      'db.m7g.large', 'db.m7g.xlarge', 'db.m7g.2xlarge', 'db.m7g.4xlarge',
      'db.m6g.large', 'db.m6g.xlarge', 'db.m6g.2xlarge', 'db.m6g.4xlarge',
      'db.m6i.large', 'db.m6i.xlarge', 'db.m6i.2xlarge', 'db.m6i.4xlarge',
    ] },
    { name: 'allocated_storage', type: 'number', default: 20, required: false, description: 'Storage in GB' },
    { name: 'db_name', type: 'string', required: true, description: 'Initial database name' },
    { name: 'username', type: 'string', default: 'admin', required: false, description: 'Master username' },
    { name: 'skip_final_snapshot', type: 'bool', default: true, required: false, description: 'Skip final snapshot on deletion' },
  ],
  outputs: [
    { name: 'endpoint', description: 'Connection endpoint', terraformExpression: 'aws_db_instance.this.endpoint' },
    { name: 'arn', description: 'RDS instance ARN', terraformExpression: 'aws_db_instance.this.arn' },
    { name: 'address', description: 'Hostname', terraformExpression: 'aws_db_instance.this.address' },
    { name: 'port', description: 'Database port', terraformExpression: 'aws_db_instance.this.port' },
  ],
  secrets: [
    { name: 'password', description: 'Master password', source: 'env' },
  ],
  requiredProviders: ['aws'],
  implicitDependencies: ['aws-vpc'],
};
