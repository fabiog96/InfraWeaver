import type { TerraformModule } from '../../types';

export const awsEventbridgeModule: TerraformModule = {
  id: 'aws-eventbridge',
  category: 'integration',
  resourceBlocks: [
    {
      resourceType: 'aws_cloudwatch_event_bus',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'bus_name' },
      ],
    },
  ],
  inputs: [
    { name: 'bus_name', type: 'string', required: true, description: 'Event bus name' },
  ],
  outputs: [
    { name: 'event_bus_arn', description: 'Event bus ARN', terraformExpression: 'aws_cloudwatch_event_bus.this.arn' },
    { name: 'event_bus_name', description: 'Event bus name', terraformExpression: 'aws_cloudwatch_event_bus.this.name' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
