import type { PackagedModule } from '../types';

export const snsConsumerLambdaModule: PackagedModule = {
  id: 'sns-consumer-lambda',
  name: 'SNS + Lambda',
  description: 'SNS topic triggering a Lambda consumer function',
  icon: 'aws-sns',
  category: 'integration',
  group: { label: 'SNS Consumer', folderName: 'sns-consumer-lambda' },
  nodes: [
    {
      relativeId: 'sns',
      serviceId: 'aws-sns',
      label: 'Topic',
      position: { x: 0, y: 0 },
      terraformInputs: { topic_name: 'my-topic' },
    },
    {
      relativeId: 'lambda',
      serviceId: 'aws-lambda',
      label: 'Consumer',
      position: { x: 0, y: 180 },
      terraformInputs: { runtime: 'python3.12', handler: 'main.lambda_handler', memory_size: 256 },
    },
    {
      relativeId: 'iam',
      serviceId: 'aws-iam',
      label: 'Lambda Role',
      position: { x: 250, y: 180 },
      terraformInputs: { role_name: 'sns-consumer-role' },
    },
  ],
  edges: [
    { sourceRelativeId: 'sns', targetRelativeId: 'lambda', label: 'subscribe' },
    { sourceRelativeId: 'iam', targetRelativeId: 'lambda', label: 'assume role' },
  ],
};
