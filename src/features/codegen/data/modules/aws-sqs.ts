import type { TerraformModule } from '../../types';

export const awsSqsModule: TerraformModule = {
  id: 'aws-sqs',
  category: 'messaging',
  resourceBlocks: [
    {
      resourceType: 'aws_sqs_queue',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'queue_name' },
        { attribute: 'visibility_timeout_seconds', fromInput: 'visibility_timeout' },
        { attribute: 'message_retention_seconds', fromInput: 'message_retention' },
        { attribute: 'delay_seconds', fromInput: 'delay_seconds' },
      ],
    },
  ],
  inputs: [
    { name: 'queue_name', type: 'string', required: true, description: 'SQS queue name' },
    { name: 'visibility_timeout', type: 'number', default: 30, required: false, description: 'Visibility timeout in seconds' },
    { name: 'message_retention', type: 'number', default: 345600, required: false, description: 'Message retention in seconds (default 4 days)' },
    { name: 'delay_seconds', type: 'number', default: 0, required: false, description: 'Delivery delay in seconds' },
  ],
  outputs: [
    { name: 'queue_arn', description: 'Queue ARN', terraformExpression: 'aws_sqs_queue.this.arn' },
    { name: 'queue_url', description: 'Queue URL', terraformExpression: 'aws_sqs_queue.this.url' },
    { name: 'queue_name', description: 'Queue name', terraformExpression: 'aws_sqs_queue.this.name' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
