import type { TerraformModule } from '../../types';

export const awsTransitGatewayModule: TerraformModule = {
  id: 'aws-transit-gateway',
  category: 'networking',
  resourceBlocks: [
    {
      resourceType: 'aws_ec2_transit_gateway',
      resourceName: 'this',
      attributes: [
        { attribute: 'description', fromInput: 'description' },
        { attribute: 'default_route_table_association', fromInput: 'default_route_table_association' },
        { attribute: 'default_route_table_propagation', fromInput: 'default_route_table_propagation' },
        { attribute: 'dns_support', fromInput: 'dns_support' },
      ],
    },
  ],
  inputs: [
    { name: 'description', type: 'string', required: false, description: 'Transit Gateway description' },
    { name: 'default_route_table_association', type: 'string', default: 'enable', required: false, description: 'Auto associate with default route table', options: ['enable', 'disable'] },
    { name: 'default_route_table_propagation', type: 'string', default: 'enable', required: false, description: 'Auto propagate to default route table', options: ['enable', 'disable'] },
    { name: 'dns_support', type: 'string', default: 'enable', required: false, description: 'DNS support', options: ['enable', 'disable'] },
  ],
  outputs: [
    { name: 'transit_gateway_id', description: 'Transit Gateway ID', terraformExpression: 'aws_ec2_transit_gateway.this.id' },
    { name: 'transit_gateway_arn', description: 'Transit Gateway ARN', terraformExpression: 'aws_ec2_transit_gateway.this.arn' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
