import type { TerraformModule } from '../../types';

export const awsRoute53Module: TerraformModule = {
  id: 'aws-route53',
  category: 'networking',
  resourceBlocks: [
    {
      resourceType: 'aws_route53_zone',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'domain_name' },
      ],
    },
  ],
  inputs: [
    { name: 'domain_name', type: 'string', required: true, description: 'Domain name' },
  ],
  outputs: [
    { name: 'zone_id', description: 'Hosted zone ID', terraformExpression: 'aws_route53_zone.this.zone_id' },
    { name: 'name_servers', description: 'Name servers', terraformExpression: 'aws_route53_zone.this.name_servers' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
