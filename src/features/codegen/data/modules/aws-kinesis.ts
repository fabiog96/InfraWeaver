import type { TerraformModule } from '../../types';

export const awsKinesisModule: TerraformModule = {
  id: 'aws-kinesis',
  category: 'analytics',
  resourceBlocks: [
    {
      resourceType: 'aws_kinesis_stream',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'stream_name' },
        { attribute: 'shard_count', fromInput: 'shard_count' },
        { attribute: 'retention_period', fromInput: 'retention_period' },
      ],
    },
  ],
  inputs: [
    { name: 'stream_name', type: 'string', required: true, description: 'Kinesis stream name' },
    { name: 'shard_count', type: 'number', default: 1, required: false, description: 'Number of shards' },
    { name: 'retention_period', type: 'number', default: 24, required: false, description: 'Retention period in hours' },
  ],
  outputs: [
    { name: 'stream_arn', description: 'Stream ARN', terraformExpression: 'aws_kinesis_stream.this.arn' },
    { name: 'stream_name', description: 'Stream name', terraformExpression: 'aws_kinesis_stream.this.name' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
