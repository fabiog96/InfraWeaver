import type { TerraformModule } from '../../types';

export const awsSagemakerModule: TerraformModule = {
  id: 'aws-sagemaker',
  category: 'ml',
  resourceBlocks: [
    {
      resourceType: 'aws_sagemaker_notebook_instance',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'notebook_name' },
        { attribute: 'instance_type', fromInput: 'instance_type' },
        { attribute: 'role_arn', fromInput: 'role_arn' },
      ],
    },
  ],
  inputs: [
    { name: 'notebook_name', type: 'string', required: true, description: 'Notebook instance name' },
    { name: 'instance_type', type: 'string', default: 'ml.t3.medium', required: false, description: 'Instance type' },
    { name: 'role_arn', type: 'string', required: false, description: 'IAM role ARN' },
  ],
  outputs: [
    { name: 'notebook_arn', description: 'Notebook ARN', terraformExpression: 'aws_sagemaker_notebook_instance.this.arn' },
    { name: 'notebook_url', description: 'Notebook URL', terraformExpression: 'aws_sagemaker_notebook_instance.this.url' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
