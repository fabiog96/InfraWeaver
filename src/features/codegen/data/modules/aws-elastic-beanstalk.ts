import type { TerraformModule } from '../../types';

export const awsElasticBeanstalkModule: TerraformModule = {
  id: 'aws-elastic-beanstalk',
  category: 'compute',
  resourceBlocks: [
    {
      resourceType: 'aws_elastic_beanstalk_application',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'application_name' },
        { attribute: 'description', fromInput: 'description' },
      ],
    },
    {
      resourceType: 'aws_elastic_beanstalk_environment',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'environment_name' },
        { attribute: 'application', fromInput: '_application_name' },
        { attribute: 'solution_stack_name', fromInput: 'solution_stack' },
        { attribute: 'tier', fromInput: 'tier' },
      ],
    },
  ],
  inputs: [
    { name: 'application_name', type: 'string', required: true, description: 'Beanstalk application name' },
    { name: 'environment_name', type: 'string', required: true, description: 'Environment name' },
    { name: 'description', type: 'string', required: false, description: 'Application description' },
    { name: 'solution_stack', type: 'string', default: '64bit Amazon Linux 2023 v4.0.0 running Python 3.12', required: false, description: 'Solution stack name' },
    { name: 'tier', type: 'string', default: 'WebServer', required: false, description: 'Environment tier', options: ['WebServer', 'Worker'] },
  ],
  outputs: [
    { name: 'application_name', description: 'Application name', terraformExpression: 'aws_elastic_beanstalk_application.this.name' },
    { name: 'environment_id', description: 'Environment ID', terraformExpression: 'aws_elastic_beanstalk_environment.this.id' },
    { name: 'endpoint_url', description: 'Environment endpoint URL', terraformExpression: 'aws_elastic_beanstalk_environment.this.endpoint_url' },
    { name: 'cname', description: 'Environment CNAME', terraformExpression: 'aws_elastic_beanstalk_environment.this.cname' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
