import type { TerraformModule } from '../../types';

export const awsXrayModule: TerraformModule = {
  id: 'aws-xray',
  category: 'monitoring',
  resourceBlocks: [
    {
      resourceType: 'aws_xray_sampling_rule',
      resourceName: 'this',
      attributes: [
        { attribute: 'rule_name', fromInput: 'rule_name' },
        { attribute: 'priority', fromInput: 'priority' },
        { attribute: 'reservoir_size', fromInput: 'reservoir_size' },
        { attribute: 'fixed_rate', fromInput: 'fixed_rate' },
        { attribute: 'url_path', fromInput: 'url_path' },
        { attribute: 'host', fromInput: 'host' },
        { attribute: 'http_method', fromInput: 'http_method' },
        { attribute: 'service_type', fromInput: 'service_type' },
        { attribute: 'service_name', fromInput: 'service_name' },
        { attribute: 'resource_arn', fromInput: 'resource_arn' },
        { attribute: 'version', fromInput: '_version' },
      ],
    },
  ],
  inputs: [
    { name: 'rule_name', type: 'string', required: true, description: 'Sampling rule name' },
    { name: 'priority', type: 'number', default: 1000, required: false, description: 'Rule priority (lower = higher priority)' },
    { name: 'reservoir_size', type: 'number', default: 1, required: false, description: 'Fixed number of requests to sample per second' },
    { name: 'fixed_rate', type: 'number', default: 0.05, required: false, description: 'Percentage of requests to sample (0.0-1.0)' },
    { name: 'url_path', type: 'string', default: '*', required: false, description: 'URL path filter' },
    { name: 'host', type: 'string', default: '*', required: false, description: 'Host filter' },
    { name: 'http_method', type: 'string', default: '*', required: false, description: 'HTTP method filter' },
    { name: 'service_type', type: 'string', default: '*', required: false, description: 'Service type filter' },
    { name: 'service_name', type: 'string', default: '*', required: false, description: 'Service name filter' },
    { name: 'resource_arn', type: 'string', default: '*', required: false, description: 'Resource ARN filter' },
  ],
  outputs: [
    { name: 'rule_arn', description: 'Sampling rule ARN', terraformExpression: 'aws_xray_sampling_rule.this.arn' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
