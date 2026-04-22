import type { TerraformModule } from '../../types';

export const awsStepFunctionsModule: TerraformModule = {
  id: 'aws-step-functions',
  category: 'integration',
  resourceBlocks: [
    {
      resourceType: 'aws_sfn_state_machine',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'state_machine_name' },
        { attribute: 'role_arn', fromInput: 'role_arn' },
        { attribute: 'definition', fromInput: 'definition' },
        { attribute: 'type', fromInput: 'type' },
      ],
    },
  ],
  inputs: [
    { name: 'state_machine_name', type: 'string', required: true, description: 'State machine name' },
    { name: 'role_arn', type: 'string', required: true, description: 'IAM role ARN' },
    { name: 'definition', type: 'string', required: true, description: 'State machine definition (JSON)' },
    { name: 'type', type: 'string', default: 'STANDARD', required: false, description: 'State machine type', options: ['STANDARD', 'EXPRESS'] },
  ],
  outputs: [
    { name: 'state_machine_arn', description: 'State machine ARN', terraformExpression: 'aws_sfn_state_machine.this.arn' },
    { name: 'state_machine_name', description: 'State machine name', terraformExpression: 'aws_sfn_state_machine.this.name' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
  implicitDependencies: ['aws-iam'],
};
