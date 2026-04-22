import type { TerraformModule } from '../../types';

export const awsNatGatewayModule: TerraformModule = {
  id: 'aws-nat-gateway',
  category: 'networking',
  resourceBlocks: [
    {
      resourceType: 'aws_eip',
      resourceName: 'this',
      attributes: [
        { attribute: 'domain', fromInput: '_domain' },
      ],
    },
    {
      resourceType: 'aws_nat_gateway',
      resourceName: 'this',
      attributes: [
        { attribute: 'allocation_id', fromInput: '_eip_allocation_id' },
        { attribute: 'subnet_id', fromInput: 'subnet_id' },
        { attribute: 'connectivity_type', fromInput: 'connectivity_type' },
      ],
    },
  ],
  inputs: [
    { name: 'subnet_id', type: 'string', required: true, description: 'Public subnet ID' },
    { name: 'connectivity_type', type: 'string', default: 'public', required: false, description: 'Connectivity type', options: ['public', 'private'] },
  ],
  outputs: [
    { name: 'nat_gateway_id', description: 'NAT Gateway ID', terraformExpression: 'aws_nat_gateway.this.id' },
    { name: 'public_ip', description: 'Elastic IP address', terraformExpression: 'aws_eip.this.public_ip' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
  implicitDependencies: ['aws-vpc'],
};
