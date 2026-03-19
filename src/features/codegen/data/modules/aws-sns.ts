import type { TerraformModule } from '../../types';

export const awsSnsModule: TerraformModule = {
  id: 'aws-sns',
  category: 'messaging',
  resourceBlocks: [
    {
      resourceType: 'aws_sns_topic',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'topic_name' },
      ],
    },
  ],
  inputs: [
    { name: 'topic_name', type: 'string', required: true, description: 'SNS topic name' },
  ],
  outputs: [
    { name: 'topic_arn', description: 'Topic ARN', terraformExpression: 'aws_sns_topic.this.arn' },
    { name: 'topic_name', description: 'Topic name', terraformExpression: 'aws_sns_topic.this.name' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
