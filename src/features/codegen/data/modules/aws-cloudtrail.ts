import type { TerraformModule } from '../../types';

export const awsCloudtrailModule: TerraformModule = {
  id: 'aws-cloudtrail',
  category: 'monitoring',
  resourceBlocks: [
    {
      resourceType: 'aws_cloudtrail',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'trail_name' },
        { attribute: 's3_bucket_name', fromInput: 's3_bucket_name' },
        { attribute: 'include_global_service_events', fromInput: 'include_global_events' },
        { attribute: 'is_multi_region_trail', fromInput: 'multi_region' },
        { attribute: 'enable_log_file_validation', fromInput: 'log_file_validation' },
      ],
    },
  ],
  inputs: [
    { name: 'trail_name', type: 'string', required: true, description: 'CloudTrail trail name' },
    { name: 's3_bucket_name', type: 'string', required: true, description: 'S3 bucket for log delivery' },
    { name: 'include_global_events', type: 'bool', default: true, required: false, description: 'Include global service events' },
    { name: 'multi_region', type: 'bool', default: true, required: false, description: 'Enable multi-region trail' },
    { name: 'log_file_validation', type: 'bool', default: true, required: false, description: 'Enable log file integrity validation' },
  ],
  outputs: [
    { name: 'trail_arn', description: 'Trail ARN', terraformExpression: 'aws_cloudtrail.this.arn' },
    { name: 'home_region', description: 'Home region', terraformExpression: 'aws_cloudtrail.this.home_region' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
  implicitDependencies: ['aws-s3'],
};
