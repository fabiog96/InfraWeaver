import type { TerraformModule } from '../../types';

export const awsApiGatewayModule: TerraformModule = {
  id: 'aws-api-gateway',
  category: 'networking',
  resourceBlocks: [
    {
      resourceType: 'aws_apigatewayv2_api',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'name' },
        { attribute: 'protocol_type', fromInput: 'protocol_type' },
        { attribute: 'description', fromInput: 'description' },
      ],
    },
    {
      resourceType: 'aws_apigatewayv2_stage',
      resourceName: 'default',
      attributes: [
        { attribute: 'api_id', fromInput: '_api_id' },
        { attribute: 'name', fromInput: 'stage_name' },
        { attribute: 'auto_deploy', fromInput: 'auto_deploy' },
      ],
    },
  ],
  inputs: [
    { name: 'name', type: 'string', required: true, description: 'API name' },
    { name: 'protocol_type', type: 'string', default: 'HTTP', required: false, description: 'Protocol (HTTP or WEBSOCKET)' },
    { name: 'description', type: 'string', required: false, description: 'API description' },
    { name: 'stage_name', type: 'string', default: '$default', required: false, description: 'Stage name' },
    { name: 'auto_deploy', type: 'bool', default: true, required: false, description: 'Auto deploy stage' },
  ],
  outputs: [
    { name: 'api_id', description: 'API Gateway ID', terraformExpression: 'aws_apigatewayv2_api.this.id' },
    { name: 'api_endpoint', description: 'API endpoint URL', terraformExpression: 'aws_apigatewayv2_api.this.api_endpoint' },
    { name: 'execution_arn', description: 'Execution ARN', terraformExpression: 'aws_apigatewayv2_api.this.execution_arn' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
