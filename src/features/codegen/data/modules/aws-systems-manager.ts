import type { TerraformModule } from '../../types';

export const awsSystemsManagerModule: TerraformModule = {
  id: 'aws-systems-manager',
  category: 'management',
  resourceBlocks: [
    {
      resourceType: 'aws_ssm_parameter',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'parameter_name' },
        { attribute: 'type', fromInput: 'parameter_type' },
        { attribute: 'value', fromInput: 'parameter_value' },
        { attribute: 'description', fromInput: 'description' },
        { attribute: 'tier', fromInput: 'tier' },
      ],
    },
  ],
  inputs: [
    { name: 'parameter_name', type: 'string', required: true, description: 'SSM parameter name (path format recommended)' },
    { name: 'parameter_type', type: 'string', default: 'String', required: false, description: 'Parameter type', options: ['String', 'StringList', 'SecureString'] },
    { name: 'parameter_value', type: 'string', required: true, description: 'Parameter value' },
    { name: 'description', type: 'string', required: false, description: 'Parameter description' },
    { name: 'tier', type: 'string', default: 'Standard', required: false, description: 'Parameter tier', options: ['Standard', 'Advanced', 'Intelligent-Tiering'] },
  ],
  outputs: [
    { name: 'parameter_arn', description: 'Parameter ARN', terraformExpression: 'aws_ssm_parameter.this.arn' },
    { name: 'parameter_version', description: 'Parameter version', terraformExpression: 'aws_ssm_parameter.this.version' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
