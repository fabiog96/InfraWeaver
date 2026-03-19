import type { TerraformModule } from '../../types';

const EC2_INSTANCE_TYPES = [
  // General Purpose
  't3.nano', 't3.micro', 't3.small', 't3.medium', 't3.large', 't3.xlarge', 't3.2xlarge',
  't3a.nano', 't3a.micro', 't3a.small', 't3a.medium', 't3a.large', 't3a.xlarge', 't3a.2xlarge',
  't4g.nano', 't4g.micro', 't4g.small', 't4g.medium', 't4g.large', 't4g.xlarge', 't4g.2xlarge',
  'm7g.medium', 'm7g.large', 'm7g.xlarge', 'm7g.2xlarge', 'm7g.4xlarge', 'm7g.8xlarge',
  'm7i.large', 'm7i.xlarge', 'm7i.2xlarge', 'm7i.4xlarge', 'm7i.8xlarge',
  'm6i.large', 'm6i.xlarge', 'm6i.2xlarge', 'm6i.4xlarge', 'm6i.8xlarge',
  'm6g.medium', 'm6g.large', 'm6g.xlarge', 'm6g.2xlarge', 'm6g.4xlarge',
  // Compute Optimized
  'c7g.medium', 'c7g.large', 'c7g.xlarge', 'c7g.2xlarge', 'c7g.4xlarge',
  'c7i.large', 'c7i.xlarge', 'c7i.2xlarge', 'c7i.4xlarge', 'c7i.8xlarge',
  'c6i.large', 'c6i.xlarge', 'c6i.2xlarge', 'c6i.4xlarge', 'c6i.8xlarge',
  'c6g.medium', 'c6g.large', 'c6g.xlarge', 'c6g.2xlarge', 'c6g.4xlarge',
  // Memory Optimized
  'r7g.medium', 'r7g.large', 'r7g.xlarge', 'r7g.2xlarge', 'r7g.4xlarge',
  'r7i.large', 'r7i.xlarge', 'r7i.2xlarge', 'r7i.4xlarge', 'r7i.8xlarge',
  'r6i.large', 'r6i.xlarge', 'r6i.2xlarge', 'r6i.4xlarge', 'r6i.8xlarge',
  'r6g.medium', 'r6g.large', 'r6g.xlarge', 'r6g.2xlarge', 'r6g.4xlarge',
  // Storage Optimized
  'i4i.large', 'i4i.xlarge', 'i4i.2xlarge', 'i4i.4xlarge',
  'd3.xlarge', 'd3.2xlarge', 'd3.4xlarge', 'd3.8xlarge',
  // Accelerated Computing
  'g5.xlarge', 'g5.2xlarge', 'g5.4xlarge', 'g5.8xlarge',
  'p4d.24xlarge',
  'inf2.xlarge', 'inf2.8xlarge', 'inf2.24xlarge',
];

export const awsEc2Module: TerraformModule = {
  id: 'aws-ec2',
  category: 'compute',
  resourceBlocks: [
    {
      resourceType: 'aws_instance',
      resourceName: 'this',
      attributes: [
        { attribute: 'ami', fromInput: 'ami' },
        { attribute: 'instance_type', fromInput: 'instance_type' },
        { attribute: 'key_name', fromInput: 'key_name' },
        { attribute: 'subnet_id', fromInput: 'subnet_id' },
      ],
    },
  ],
  inputs: [
    { name: 'ami', type: 'string', required: true, description: 'AMI ID' },
    { name: 'instance_type', type: 'string', default: 't3.micro', required: false, description: 'Instance type', options: EC2_INSTANCE_TYPES },
    { name: 'key_name', type: 'string', required: false, description: 'SSH key pair name' },
    { name: 'subnet_id', type: 'string', required: false, description: 'Subnet ID' },
  ],
  outputs: [
    { name: 'instance_id', description: 'Instance ID', terraformExpression: 'aws_instance.this.id' },
    { name: 'public_ip', description: 'Public IP address', terraformExpression: 'aws_instance.this.public_ip' },
    { name: 'private_ip', description: 'Private IP address', terraformExpression: 'aws_instance.this.private_ip' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
  implicitDependencies: ['aws-vpc'],
};
