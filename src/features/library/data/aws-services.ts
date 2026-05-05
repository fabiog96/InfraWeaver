import type { ServiceDefinition } from '@/shared/types';

const categoryColors: Record<string, string> = {
  compute: '#FF9900',
  containers: '#FF9900',
  storage: '#3B922E',
  database: '#3366CC',
  networking: '#8C4FFF',
  messaging: '#E7157B',
  integration: '#E7157B',
  security: '#DD344C',
  monitoring: '#00A1C9',
  analytics: '#527FFF',
  ml: '#116D5B',
  devtools: '#00A1C9',
  management: '#B0084D',
};

const aws = (id: string, label: string, serviceType: string, category: string): ServiceDefinition => ({
  id: `aws-${id}`, label, provider: 'aws', serviceType, icon: `aws-${id}`, category,
  defaultColor: categoryColors[category] ?? '#FF9900',
});

export const awsServices: ServiceDefinition[] = [
  // Compute
  aws('ec2', 'EC2', 'EC2 Instance', 'compute'),
  aws('lambda', 'Lambda', 'Lambda Function', 'compute'),
  aws('fargate', 'Fargate', 'Fargate Service', 'compute'),
  aws('batch', 'Batch', 'Batch Job', 'compute'),
  aws('lightsail', 'Lightsail', 'Lightsail Instance', 'compute'),
  aws('elastic-beanstalk', 'Elastic Beanstalk', 'Beanstalk App', 'compute'),

  // Containers
  aws('ecs', 'ECS', 'ECS Cluster', 'containers'),
  aws('eks', 'EKS', 'EKS Cluster', 'containers'),
  aws('ecr', 'ECR', 'Container Registry', 'containers'),

  // Storage
  aws('s3', 'S3', 'S3 Bucket', 'storage'),
  aws('efs', 'EFS', 'Elastic File System', 'storage'),
  aws('ebs', 'EBS', 'Block Storage', 'storage'),
  aws('glacier', 'Glacier', 'Archive Storage', 'storage'),
  aws('backup', 'Backup', 'Backup Service', 'storage'),

  // Database
  aws('rds', 'RDS', 'RDS Instance', 'database'),
  aws('dynamodb', 'DynamoDB', 'DynamoDB Table', 'database'),
  aws('dynamodb-streams', 'DynamoDB Streams', 'DynamoDB Stream', 'integration'),
  aws('elasticache', 'ElastiCache', 'ElastiCache Cluster', 'database'),
  aws('aurora', 'Aurora', 'Aurora Cluster', 'database'),
  aws('redshift', 'Redshift', 'Data Warehouse', 'database'),
  aws('neptune', 'Neptune', 'Graph Database', 'database'),
  aws('documentdb', 'DocumentDB', 'Document Database', 'database'),

  // Networking
  aws('cloudfront', 'CloudFront', 'CloudFront Distribution', 'networking'),
  aws('api-gateway', 'API Gateway', 'API Gateway', 'networking'),
  aws('elb', 'ELB', 'Load Balancer', 'networking'),
  aws('route53', 'Route 53', 'DNS Service', 'networking'),
  aws('vpc', 'VPC', 'Virtual Private Cloud', 'networking'),
  aws('nat-gateway', 'NAT Gateway', 'NAT Gateway', 'networking'),
  aws('transit-gateway', 'Transit Gateway', 'Transit Gateway', 'networking'),
  aws('direct-connect', 'Direct Connect', 'Direct Connect', 'networking'),
  aws('privatelink', 'PrivateLink', 'VPC Endpoint', 'networking'),
  aws('global-accelerator', 'Global Accelerator', 'Global Accelerator', 'networking'),

  // Event Sources
  aws('s3-event', 'S3 Event', 'S3 Event Notification', 'integration'),
  aws('cloudwatch-alarm', 'CW Alarm', 'CloudWatch Alarm', 'monitoring'),
  aws('cloudwatch-event', 'CW Event', 'CloudWatch Event', 'integration'),
  aws('cognito-trigger', 'Cognito Trigger', 'Cognito User Pool Trigger', 'integration'),
  aws('eventbridge-rule', 'EB Rule', 'EventBridge Rule', 'integration'),
  aws('eventbridge-scheduler', 'EB Scheduler', 'EventBridge Scheduler', 'integration'),
  aws('sns-topic', 'SNS Topic', 'SNS Topic', 'messaging'),
  aws('sqs-queue', 'SQS Queue', 'SQS Queue', 'messaging'),

  // Messaging
  aws('sns', 'SNS', 'Simple Notification', 'messaging'),
  aws('sqs', 'SQS', 'Simple Queue', 'messaging'),
  aws('mq', 'Amazon MQ', 'Message Broker', 'messaging'),

  // Integration
  aws('eventbridge', 'EventBridge', 'Event Bus', 'integration'),
  aws('step-functions', 'Step Functions', 'State Machine', 'integration'),
  aws('appsync', 'AppSync', 'GraphQL API', 'integration'),

  // Security
  aws('iam', 'IAM', 'Identity & Access', 'security'),
  aws('cognito', 'Cognito', 'User Pool', 'security'),
  aws('waf', 'WAF', 'Web App Firewall', 'security'),
  aws('guardduty', 'GuardDuty', 'Threat Detection', 'security'),
  aws('secrets-manager', 'Secrets Manager', 'Secrets Manager', 'security'),
  aws('kms', 'KMS', 'Key Management', 'security'),
  aws('acm', 'ACM', 'Certificate Manager', 'security'),

  // Monitoring
  aws('cloudwatch', 'CloudWatch', 'Monitoring', 'monitoring'),
  aws('xray', 'X-Ray', 'Distributed Tracing', 'monitoring'),
  aws('cloudtrail', 'CloudTrail', 'Audit Logging', 'monitoring'),

  // Analytics
  aws('kinesis', 'Kinesis', 'Data Stream', 'analytics'),
  aws('athena', 'Athena', 'Query Service', 'analytics'),
  aws('glue', 'Glue', 'ETL Service', 'analytics'),
  aws('emr', 'EMR', 'Hadoop/Spark', 'analytics'),
  aws('quicksight', 'QuickSight', 'BI Dashboard', 'analytics'),

  // Machine Learning
  aws('sagemaker', 'SageMaker', 'ML Platform', 'ml'),
  aws('bedrock', 'Bedrock', 'Foundation Models', 'ml'),

  // Developer Tools
  aws('codepipeline', 'CodePipeline', 'CI/CD Pipeline', 'devtools'),
  aws('codebuild', 'CodeBuild', 'Build Service', 'devtools'),
  aws('codedeploy', 'CodeDeploy', 'Deploy Service', 'devtools'),

  // Management
  aws('cloudformation', 'CloudFormation', 'IaC Service', 'management'),
  aws('systems-manager', 'Systems Manager', 'Ops Management', 'management'),
];
