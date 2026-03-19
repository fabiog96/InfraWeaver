import type { TerraformModule } from '../../types';

export const awsDynamodbModule: TerraformModule = {
  id: 'aws-dynamodb',
  category: 'database',
  resourceBlocks: [
    {
      resourceType: 'aws_dynamodb_table',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'table_name' },
        { attribute: 'billing_mode', fromInput: 'billing_mode' },
        { attribute: 'hash_key', fromInput: 'hash_key' },
        { attribute: 'range_key', fromInput: 'range_key' },
      ],
      nestedBlocks: [
        {
          blockType: 'attribute',
          attributes: [
            { attribute: 'name', fromInput: 'hash_key' },
            { attribute: 'type', fromInput: 'hash_key_type' },
          ],
        },
      ],
    },
  ],
  inputs: [
    { name: 'table_name', type: 'string', required: true, description: 'DynamoDB table name' },
    { name: 'billing_mode', type: 'string', default: 'PAY_PER_REQUEST', required: false, description: 'Billing mode (PAY_PER_REQUEST or PROVISIONED)' },
    { name: 'hash_key', type: 'string', default: 'pk', required: true, description: 'Partition key name' },
    { name: 'hash_key_type', type: 'string', default: 'S', required: false, description: 'Partition key type (S, N, B)' },
    { name: 'range_key', type: 'string', required: false, description: 'Sort key name' },
  ],
  outputs: [
    { name: 'table_arn', description: 'Table ARN', terraformExpression: 'aws_dynamodb_table.this.arn' },
    { name: 'table_name', description: 'Table name', terraformExpression: 'aws_dynamodb_table.this.name' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
