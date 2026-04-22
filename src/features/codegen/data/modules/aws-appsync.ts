import type { TerraformModule } from '../../types';

export const awsAppsyncModule: TerraformModule = {
  id: 'aws-appsync',
  category: 'integration',
  resourceBlocks: [
    {
      resourceType: 'aws_appsync_graphql_api',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'api_name' },
        { attribute: 'authentication_type', fromInput: 'authentication_type' },
        { attribute: 'schema', fromInput: 'schema' },
      ],
    },
  ],
  inputs: [
    { name: 'api_name', type: 'string', required: true, description: 'GraphQL API name' },
    { name: 'authentication_type', type: 'string', default: 'API_KEY', required: false, description: 'Authentication type', options: ['API_KEY', 'AWS_IAM', 'AMAZON_COGNITO_USER_POOLS', 'OPENID_CONNECT', 'AWS_LAMBDA'] },
    { name: 'schema', type: 'string', required: false, description: 'GraphQL schema definition' },
  ],
  outputs: [
    { name: 'api_id', description: 'API ID', terraformExpression: 'aws_appsync_graphql_api.this.id' },
    { name: 'api_arn', description: 'API ARN', terraformExpression: 'aws_appsync_graphql_api.this.arn' },
    { name: 'uris', description: 'API URIs', terraformExpression: 'aws_appsync_graphql_api.this.uris' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
