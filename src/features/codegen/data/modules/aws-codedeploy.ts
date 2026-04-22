import type { TerraformModule } from '../../types';

export const awsCodedeployModule: TerraformModule = {
  id: 'aws-codedeploy',
  category: 'devtools',
  resourceBlocks: [
    {
      resourceType: 'aws_codedeploy_app',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'application_name' },
        { attribute: 'compute_platform', fromInput: 'compute_platform' },
      ],
    },
    {
      resourceType: 'aws_codedeploy_deployment_group',
      resourceName: 'this',
      attributes: [
        { attribute: 'app_name', fromInput: '_app_name' },
        { attribute: 'deployment_group_name', fromInput: 'deployment_group_name' },
        { attribute: 'service_role_arn', fromInput: 'service_role_arn' },
        { attribute: 'deployment_config_name', fromInput: 'deployment_config' },
      ],
    },
  ],
  inputs: [
    { name: 'application_name', type: 'string', required: true, description: 'CodeDeploy application name' },
    { name: 'compute_platform', type: 'string', default: 'Server', required: false, description: 'Compute platform', options: ['Server', 'Lambda', 'ECS'] },
    { name: 'deployment_group_name', type: 'string', required: true, description: 'Deployment group name' },
    { name: 'service_role_arn', type: 'string', required: true, description: 'IAM service role ARN' },
    { name: 'deployment_config', type: 'string', default: 'CodeDeployDefault.AllAtOnce', required: false, description: 'Deployment config', options: ['CodeDeployDefault.AllAtOnce', 'CodeDeployDefault.HalfAtATime', 'CodeDeployDefault.OneAtATime'] },
  ],
  outputs: [
    { name: 'app_id', description: 'Application ID', terraformExpression: 'aws_codedeploy_app.this.id' },
    { name: 'app_name', description: 'Application name', terraformExpression: 'aws_codedeploy_app.this.name' },
    { name: 'deployment_group_id', description: 'Deployment group ID', terraformExpression: 'aws_codedeploy_deployment_group.this.id' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
  implicitDependencies: ['aws-iam'],
};
