import type { PackagedModule } from '../types';

export const scheduledLambdaModule: PackagedModule = {
  id: 'scheduled-lambda',
  name: 'Scheduled Lambda',
  description: 'EventBridge rule triggering a Lambda function on a cron schedule',
  icon: 'aws-lambda',
  category: 'backend',
  group: { label: 'Scheduled Lambda', folderName: 'scheduled-lambda' },
  nodes: [
    {
      relativeId: 'eventbridge',
      serviceId: 'aws-eventbridge',
      label: 'Schedule Rule',
      position: { x: 0, y: 0 },
      terraformInputs: { bus_name: 'default' },
    },
    {
      relativeId: 'lambda',
      serviceId: 'aws-lambda',
      label: 'Handler',
      position: { x: 0, y: 180 },
      terraformInputs: { runtime: 'python3.12', handler: 'main.lambda_handler', memory_size: 256 },
    },
    {
      relativeId: 'iam',
      serviceId: 'aws-iam',
      label: 'Lambda Role',
      position: { x: 250, y: 180 },
      terraformInputs: { role_name: 'scheduled-lambda-role' },
    },
  ],
  edges: [
    { sourceRelativeId: 'eventbridge', targetRelativeId: 'lambda', label: 'trigger' },
    { sourceRelativeId: 'iam', targetRelativeId: 'lambda', label: 'assume role' },
  ],
};
