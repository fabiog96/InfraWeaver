import type { TerraformModule } from '../../types';

export const awsLambdaModule: TerraformModule = {
  id: 'aws-lambda',
  category: 'compute',
  resourceBlocks: [
    {
      resourceType: 'aws_lambda_function',
      resourceName: 'this',
      attributes: [
        { attribute: 'function_name', fromInput: 'function_name' },
        { attribute: 'runtime', fromInput: 'runtime' },
        { attribute: 'handler', fromInput: 'handler' },
        { attribute: 'memory_size', fromInput: 'memory_size' },
        { attribute: 'timeout', fromInput: 'timeout' },
        { attribute: 'role', fromInput: 'role_arn' },
      ],
    },
  ],
  inputs: [
    { name: 'function_name', type: 'string', required: true, description: 'Lambda function name' },
    { name: 'runtime', type: 'string', default: 'python3.12', required: false, description: 'Runtime environment', options: [
      'python3.13', 'python3.12', 'python3.11', 'python3.10', 'python3.9',
      'nodejs22.x', 'nodejs20.x', 'nodejs18.x',
      'java21', 'java17', 'java11',
      'dotnet8', 'dotnet6',
      'ruby3.3', 'ruby3.2',
      'provided.al2023', 'provided.al2',
    ] },
    { name: 'handler', type: 'string', default: 'main.lambda_handler', required: false, description: 'Function handler' },
    { name: 'memory_size', type: 'number', default: 256, required: false, description: 'Memory in MB' },
    { name: 'timeout', type: 'number', default: 30, required: false, description: 'Timeout in seconds' },
    { name: 'role_arn', type: 'string', required: false, description: 'IAM role ARN' },
  ],
  outputs: [
    { name: 'function_arn', description: 'Lambda function ARN', terraformExpression: 'aws_lambda_function.this.arn' },
    { name: 'function_name', description: 'Function name', terraformExpression: 'aws_lambda_function.this.function_name' },
    { name: 'invoke_arn', description: 'Invoke ARN', terraformExpression: 'aws_lambda_function.this.invoke_arn' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
