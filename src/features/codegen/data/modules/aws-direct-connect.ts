import type { TerraformModule } from '../../types';

export const awsDirectConnectModule: TerraformModule = {
  id: 'aws-direct-connect',
  category: 'networking',
  resourceBlocks: [
    {
      resourceType: 'aws_dx_gateway',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'gateway_name' },
        { attribute: 'amazon_side_asn', fromInput: 'amazon_side_asn' },
      ],
    },
  ],
  inputs: [
    { name: 'gateway_name', type: 'string', required: true, description: 'Direct Connect gateway name' },
    { name: 'amazon_side_asn', type: 'string', default: '64512', required: false, description: 'Amazon side ASN' },
  ],
  outputs: [
    { name: 'gateway_id', description: 'Gateway ID', terraformExpression: 'aws_dx_gateway.this.id' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
