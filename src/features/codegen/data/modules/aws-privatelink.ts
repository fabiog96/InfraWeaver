import type { TerraformModule } from '../../types';

export const awsPrivatelinkModule: TerraformModule = {
  id: 'aws-privatelink',
  category: 'networking',
  resourceBlocks: [
    {
      resourceType: 'aws_vpc_endpoint',
      resourceName: 'this',
      attributes: [
        { attribute: 'vpc_id', fromInput: 'vpc_id' },
        { attribute: 'service_name', fromInput: 'service_name' },
        { attribute: 'vpc_endpoint_type', fromInput: 'endpoint_type' },
        { attribute: 'subnet_ids', fromInput: 'subnet_ids' },
        { attribute: 'security_group_ids', fromInput: 'security_group_ids' },
        { attribute: 'private_dns_enabled', fromInput: 'private_dns_enabled' },
      ],
    },
  ],
  inputs: [
    { name: 'vpc_id', type: 'string', required: true, description: 'VPC ID' },
    { name: 'service_name', type: 'string', required: true, description: 'AWS service name (e.g. com.amazonaws.region.s3)' },
    { name: 'endpoint_type', type: 'string', default: 'Interface', required: false, description: 'Endpoint type', options: ['Interface', 'Gateway', 'GatewayLoadBalancer'] },
    { name: 'subnet_ids', type: 'list', required: false, description: 'Subnet IDs for Interface endpoints' },
    { name: 'security_group_ids', type: 'list', required: false, description: 'Security group IDs' },
    { name: 'private_dns_enabled', type: 'bool', default: true, required: false, description: 'Enable private DNS' },
  ],
  outputs: [
    { name: 'endpoint_id', description: 'VPC Endpoint ID', terraformExpression: 'aws_vpc_endpoint.this.id' },
    { name: 'dns_entry', description: 'DNS entries', terraformExpression: 'aws_vpc_endpoint.this.dns_entry' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
  implicitDependencies: ['aws-vpc'],
};
