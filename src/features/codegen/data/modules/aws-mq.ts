import type { TerraformModule } from '../../types';

export const awsMqModule: TerraformModule = {
  id: 'aws-mq',
  category: 'messaging',
  resourceBlocks: [
    {
      resourceType: 'aws_mq_broker',
      resourceName: 'this',
      attributes: [
        { attribute: 'broker_name', fromInput: 'broker_name' },
        { attribute: 'engine_type', fromInput: 'engine_type' },
        { attribute: 'engine_version', fromInput: 'engine_version' },
        { attribute: 'host_instance_type', fromInput: 'instance_type' },
        { attribute: 'deployment_mode', fromInput: 'deployment_mode' },
        { attribute: 'publicly_accessible', fromInput: 'publicly_accessible' },
      ],
      nestedBlocks: [
        {
          blockType: 'user',
          attributes: [
            { attribute: 'username', fromInput: 'admin_username' },
            { attribute: 'password', fromInput: 'admin_password' },
          ],
        },
      ],
    },
  ],
  inputs: [
    { name: 'broker_name', type: 'string', required: true, description: 'MQ broker name' },
    { name: 'engine_type', type: 'string', default: 'RabbitMQ', required: false, description: 'Engine type', options: ['ActiveMQ', 'RabbitMQ'] },
    { name: 'engine_version', type: 'string', default: '3.13', required: false, description: 'Engine version' },
    { name: 'instance_type', type: 'string', default: 'mq.m5.large', required: false, description: 'Host instance type', options: ['mq.t3.micro', 'mq.m5.large', 'mq.m5.xlarge', 'mq.m5.2xlarge', 'mq.m5.4xlarge'] },
    { name: 'deployment_mode', type: 'string', default: 'SINGLE_INSTANCE', required: false, description: 'Deployment mode', options: ['SINGLE_INSTANCE', 'ACTIVE_STANDBY_MULTI_AZ', 'CLUSTER_MULTI_AZ'] },
    { name: 'publicly_accessible', type: 'bool', default: false, required: false, description: 'Enable public access' },
    { name: 'admin_username', type: 'string', default: 'admin', required: false, description: 'Admin username' },
  ],
  outputs: [
    { name: 'broker_id', description: 'Broker ID', terraformExpression: 'aws_mq_broker.this.id' },
    { name: 'broker_arn', description: 'Broker ARN', terraformExpression: 'aws_mq_broker.this.arn' },
  ],
  secrets: [
    { name: 'admin_password', description: 'Admin password', source: 'secretsmanager' },
  ],
  requiredProviders: ['aws'],
  implicitDependencies: ['aws-vpc'],
};
