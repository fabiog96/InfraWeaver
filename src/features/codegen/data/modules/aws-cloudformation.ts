import type { TerraformModule } from '../../types';

export const awsCloudformationModule: TerraformModule = {
  id: 'aws-cloudformation',
  category: 'management',
  resourceBlocks: [
    {
      resourceType: 'aws_cloudformation_stack',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'stack_name' },
        { attribute: 'template_url', fromInput: 'template_url' },
        { attribute: 'template_body', fromInput: 'template_body' },
        { attribute: 'capabilities', fromInput: 'capabilities' },
      ],
    },
  ],
  inputs: [
    { name: 'stack_name', type: 'string', required: true, description: 'CloudFormation stack name' },
    { name: 'template_url', type: 'string', required: false, description: 'S3 URL of the template' },
    { name: 'template_body', type: 'string', required: false, description: 'Template body (JSON/YAML)' },
    { name: 'capabilities', type: 'list', required: false, description: 'Stack capabilities (e.g. CAPABILITY_IAM)' },
  ],
  outputs: [
    { name: 'stack_id', description: 'Stack ID', terraformExpression: 'aws_cloudformation_stack.this.id' },
    { name: 'outputs', description: 'Stack outputs', terraformExpression: 'aws_cloudformation_stack.this.outputs' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
