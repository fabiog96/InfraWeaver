import type { PackagedModule } from '../types';

export const apiGatewaySqsModule: PackagedModule = {
  id: 'api-gateway-sqs',
  name: 'API Gateway + SQS',
  description: 'API Gateway that pushes messages directly to an SQS queue',
  icon: 'aws-api-gateway',
  category: 'integration',
  group: { label: 'API to Queue', folderName: 'api-gateway-to-sqs' },
  nodes: [
    {
      relativeId: 'apigw',
      serviceId: 'aws-api-gateway',
      label: 'API Gateway',
      position: { x: 0, y: 0 },
      terraformInputs: { name: 'my-api', protocol_type: 'HTTP' },
    },
    {
      relativeId: 'sqs',
      serviceId: 'aws-sqs',
      label: 'Queue',
      position: { x: 0, y: 180 },
      terraformInputs: { queue_name: 'my-queue' },
    },
    {
      relativeId: 'iam',
      serviceId: 'aws-iam',
      label: 'Integration Role',
      position: { x: 250, y: 90 },
      terraformInputs: { role_name: 'apigw-sqs-role' },
    },
  ],
  edges: [
    { sourceRelativeId: 'apigw', targetRelativeId: 'sqs', label: 'send message' },
    { sourceRelativeId: 'iam', targetRelativeId: 'apigw', label: 'assume role' },
  ],
};
