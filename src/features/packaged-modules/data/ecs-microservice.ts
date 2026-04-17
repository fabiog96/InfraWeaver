import type { PackagedModule } from '../types';

export const ecsMicroserviceModule: PackagedModule = {
  id: 'ecs-microservice',
  name: 'ECS + ALB',
  description: 'ECS Fargate service behind an Application Load Balancer',
  icon: 'aws-ecs',
  category: 'backend',
  group: { label: 'ECS Microservice', folderName: 'ecs-microservice-api' },
  nodes: [
    {
      relativeId: 'alb',
      serviceId: 'aws-elb',
      label: 'ALB',
      position: { x: 0, y: 0 },
      terraformInputs: { name: 'my-alb', load_balancer_type: 'application', internal: false },
    },
    {
      relativeId: 'ecs',
      serviceId: 'aws-ecs',
      label: 'ECS Service',
      position: { x: 0, y: 180 },
      terraformInputs: { cluster_name: 'my-cluster' },
    },
    {
      relativeId: 'ecr',
      serviceId: 'aws-ecr',
      label: 'Container Registry',
      position: { x: 250, y: 180 },
      terraformInputs: { repository_name: 'my-service' },
    },
  ],
  edges: [
    { sourceRelativeId: 'alb', targetRelativeId: 'ecs', label: 'forward' },
    { sourceRelativeId: 'ecr', targetRelativeId: 'ecs', label: 'pull image' },
  ],
};
