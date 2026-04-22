import type { TerraformModule } from '../../types';

export const awsEfsModule: TerraformModule = {
  id: 'aws-efs',
  category: 'storage',
  resourceBlocks: [
    {
      resourceType: 'aws_efs_file_system',
      resourceName: 'this',
      attributes: [
        { attribute: 'encrypted', fromInput: 'encrypted' },
        { attribute: 'performance_mode', fromInput: 'performance_mode' },
        { attribute: 'throughput_mode', fromInput: 'throughput_mode' },
      ],
    },
  ],
  inputs: [
    { name: 'encrypted', type: 'bool', default: true, required: false, description: 'Enable encryption at rest' },
    { name: 'performance_mode', type: 'string', default: 'generalPurpose', required: false, description: 'Performance mode', options: ['generalPurpose', 'maxIO'] },
    { name: 'throughput_mode', type: 'string', default: 'bursting', required: false, description: 'Throughput mode', options: ['bursting', 'provisioned', 'elastic'] },
  ],
  outputs: [
    { name: 'file_system_id', description: 'File system ID', terraformExpression: 'aws_efs_file_system.this.id' },
    { name: 'file_system_arn', description: 'File system ARN', terraformExpression: 'aws_efs_file_system.this.arn' },
    { name: 'dns_name', description: 'DNS name', terraformExpression: 'aws_efs_file_system.this.dns_name' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
