import type { PackagedModule } from '../types';

export const gatewayLambda: PackagedModule = {
  id: 'api-gateway-lambda',
  name: 'API Gateway + Lambda',
  description: 'API Gateway + Lambda + DynamoDB + IAM Role',
  icon: 'aws-lambda',
  category: 'backend',
  group: { label: 'Serverless API', folderName: 'serverless-api' },
  nodes: [
    {
      relativeId: 'apigw',
      serviceId: 'aws-api-gateway',
      label: 'API Gateway',
      position: { x: 0, y: 0 },
      terraformInputs: { name: 'my-api', protocol_type: 'HTTP' },
    },
    {
      relativeId: 'lambda',
      serviceId: 'aws-lambda',
      label: 'Handler',
      position: { x: 0, y: 180 },
      terraformInputs: { runtime: 'python3.12', handler: 'main.lambda_handler', memory_size: 256 },
    },
    {
      relativeId: 'dynamodb',
      serviceId: 'aws-dynamodb',
      label: 'Data Store',
      position: { x: 0, y: 360 },
      terraformInputs: { billing_mode: 'PAY_PER_REQUEST', hash_key: 'pk', hash_key_type: 'S' },
    },
    {
      relativeId: 'iam',
      serviceId: 'aws-iam',
      label: 'Lambda Role',
      position: { x: 250, y: 180 },
      terraformInputs: { role_name: 'lambda-execution-role' },
    },
  ],
  edges: [
    { sourceRelativeId: 'apigw', targetRelativeId: 'lambda', label: 'invoke' },
    { sourceRelativeId: 'lambda', targetRelativeId: 'dynamodb', label: 'read/write' },
    { sourceRelativeId: 'iam', targetRelativeId: 'lambda', label: 'assume role' },
  ],
};
