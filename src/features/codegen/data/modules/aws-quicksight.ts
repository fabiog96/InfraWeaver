import type { TerraformModule } from '../../types';

export const awsQuicksightModule: TerraformModule = {
  id: 'aws-quicksight',
  category: 'analytics',
  resourceBlocks: [
    {
      resourceType: 'aws_quicksight_data_source',
      resourceName: 'this',
      attributes: [
        { attribute: 'data_source_id', fromInput: 'data_source_id' },
        { attribute: 'name', fromInput: 'data_source_name' },
        { attribute: 'type', fromInput: 'data_source_type' },
      ],
    },
  ],
  inputs: [
    { name: 'data_source_id', type: 'string', required: true, description: 'Data source ID' },
    { name: 'data_source_name', type: 'string', required: true, description: 'Data source name' },
    { name: 'data_source_type', type: 'string', default: 'ATHENA', required: false, description: 'Data source type', options: ['ATHENA', 'S3', 'REDSHIFT', 'RDS', 'AURORA', 'POSTGRESQL', 'MYSQL'] },
  ],
  outputs: [
    { name: 'data_source_arn', description: 'Data source ARN', terraformExpression: 'aws_quicksight_data_source.this.arn' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
