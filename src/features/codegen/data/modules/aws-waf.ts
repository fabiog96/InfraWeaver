import type { TerraformModule } from '../../types';

export const awsWafModule: TerraformModule = {
  id: 'aws-waf',
  category: 'security',
  resourceBlocks: [
    {
      resourceType: 'aws_wafv2_web_acl',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'acl_name' },
        { attribute: 'scope', fromInput: 'scope' },
        { attribute: 'description', fromInput: 'description' },
      ],
      nestedBlocks: [
        {
          blockType: 'default_action',
          attributes: [],
        },
        {
          blockType: 'visibility_config',
          attributes: [
            { attribute: 'cloudwatch_metrics_enabled', fromInput: 'metrics_enabled' },
            { attribute: 'metric_name', fromInput: '_metric_name' },
            { attribute: 'sampled_requests_enabled', fromInput: 'sampled_requests_enabled' },
          ],
        },
      ],
    },
  ],
  inputs: [
    { name: 'acl_name', type: 'string', required: true, description: 'Web ACL name' },
    { name: 'scope', type: 'string', default: 'REGIONAL', required: false, description: 'Scope (REGIONAL for ALB/API GW, CLOUDFRONT for CF)', options: ['REGIONAL', 'CLOUDFRONT'] },
    { name: 'description', type: 'string', required: false, description: 'Web ACL description' },
    { name: 'metrics_enabled', type: 'bool', default: true, required: false, description: 'Enable CloudWatch metrics' },
    { name: 'sampled_requests_enabled', type: 'bool', default: true, required: false, description: 'Enable sampled requests' },
  ],
  outputs: [
    { name: 'acl_arn', description: 'Web ACL ARN', terraformExpression: 'aws_wafv2_web_acl.this.arn' },
    { name: 'acl_id', description: 'Web ACL ID', terraformExpression: 'aws_wafv2_web_acl.this.id' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
