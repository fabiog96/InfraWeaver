import type { TerraformModule } from '../../types';

export const awsElbModule: TerraformModule = {
  id: 'aws-elb',
  category: 'networking',
  resourceBlocks: [
    {
      resourceType: 'aws_lb',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'name' },
        { attribute: 'internal', fromInput: 'internal' },
        { attribute: 'load_balancer_type', fromInput: 'load_balancer_type' },
      ],
    },
  ],
  inputs: [
    { name: 'name', type: 'string', required: true, description: 'Load balancer name' },
    { name: 'internal', type: 'bool', default: false, required: false, description: 'Internal load balancer' },
    { name: 'load_balancer_type', type: 'string', default: 'application', required: false, description: 'Type (application or network)' },
  ],
  outputs: [
    { name: 'arn', description: 'Load balancer ARN', terraformExpression: 'aws_lb.this.arn' },
    { name: 'dns_name', description: 'DNS name', terraformExpression: 'aws_lb.this.dns_name' },
    { name: 'zone_id', description: 'Zone ID', terraformExpression: 'aws_lb.this.zone_id' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
  implicitDependencies: ['aws-vpc'],
};
