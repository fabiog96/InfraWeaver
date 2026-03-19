import type { TerraformModule } from '../../types';

export const awsCloudfrontModule: TerraformModule = {
  id: 'aws-cloudfront',
  category: 'networking',
  resourceBlocks: [
    {
      resourceType: 'aws_cloudfront_distribution',
      resourceName: 'this',
      attributes: [
        { attribute: 'enabled', fromInput: 'enabled' },
        { attribute: 'default_root_object', fromInput: 'default_root_object' },
        { attribute: 'price_class', fromInput: 'price_class' },
      ],
    },
  ],
  inputs: [
    { name: 'enabled', type: 'bool', default: true, required: false, description: 'Distribution enabled' },
    { name: 'default_root_object', type: 'string', default: 'index.html', required: false, description: 'Default root object' },
    { name: 'price_class', type: 'string', default: 'PriceClass_100', required: false, description: 'Price class' },
    { name: 'origin_domain_name', type: 'string', required: true, description: 'Origin domain name (S3 bucket domain, ALB DNS, etc.)' },
  ],
  outputs: [
    { name: 'distribution_id', description: 'Distribution ID', terraformExpression: 'aws_cloudfront_distribution.this.id' },
    { name: 'domain_name', description: 'CloudFront domain name', terraformExpression: 'aws_cloudfront_distribution.this.domain_name' },
    { name: 'arn', description: 'Distribution ARN', terraformExpression: 'aws_cloudfront_distribution.this.arn' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
