import type { TerraformModule } from '../../types';

export const awsVpcModule: TerraformModule = {
  id: 'aws-vpc',
  category: 'networking',
  resourceBlocks: [
    {
      resourceType: 'aws_vpc',
      resourceName: 'this',
      attributes: [
        { attribute: 'cidr_block', fromInput: 'cidr_block' },
        { attribute: 'enable_dns_support', fromInput: 'enable_dns_support' },
        { attribute: 'enable_dns_hostnames', fromInput: 'enable_dns_hostnames' },
      ],
    },
  ],
  inputs: [
    { name: 'cidr_block', type: 'string', default: '10.0.0.0/16', required: true, description: 'VPC CIDR block' },
    { name: 'enable_dns_support', type: 'bool', default: true, required: false, description: 'Enable DNS support' },
    { name: 'enable_dns_hostnames', type: 'bool', default: true, required: false, description: 'Enable DNS hostnames' },
  ],
  outputs: [
    { name: 'vpc_id', description: 'VPC ID', terraformExpression: 'aws_vpc.this.id' },
    { name: 'vpc_cidr', description: 'VPC CIDR block', terraformExpression: 'aws_vpc.this.cidr_block' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
