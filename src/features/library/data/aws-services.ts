import type { ServiceDefinition } from '@/shared/types';

export const awsServices: ServiceDefinition[] = [
  { id: 'aws-ec2', label: 'EC2', provider: 'aws', serviceType: 'EC2 Instance', icon: 'aws-ec2', category: 'compute', defaultColor: '#FF9900' },
  { id: 'aws-lambda', label: 'Lambda', provider: 'aws', serviceType: 'Lambda Function', icon: 'aws-lambda', category: 'compute', defaultColor: '#FF9900' },
  { id: 'aws-ecs', label: 'ECS', provider: 'aws', serviceType: 'ECS Cluster', icon: 'aws-ecs', category: 'containers', defaultColor: '#FF9900' },
  { id: 'aws-eks', label: 'EKS', provider: 'aws', serviceType: 'EKS Cluster', icon: 'aws-eks', category: 'containers', defaultColor: '#FF9900' },
  { id: 'aws-s3', label: 'S3', provider: 'aws', serviceType: 'S3 Bucket', icon: 'aws-s3', category: 'storage', defaultColor: '#FF9900' },
  { id: 'aws-rds', label: 'RDS', provider: 'aws', serviceType: 'RDS Instance', icon: 'aws-rds', category: 'database', defaultColor: '#FF9900' },
  { id: 'aws-dynamodb', label: 'DynamoDB', provider: 'aws', serviceType: 'DynamoDB Table', icon: 'aws-dynamodb', category: 'database', defaultColor: '#FF9900' },
  { id: 'aws-elasticache', label: 'ElastiCache', provider: 'aws', serviceType: 'ElastiCache Cluster', icon: 'aws-elasticache', category: 'database', defaultColor: '#FF9900' },
  { id: 'aws-cloudfront', label: 'CloudFront', provider: 'aws', serviceType: 'CloudFront Distribution', icon: 'aws-cloudfront', category: 'networking', defaultColor: '#FF9900' },
  { id: 'aws-api-gateway', label: 'API Gateway', provider: 'aws', serviceType: 'API Gateway', icon: 'aws-api-gateway', category: 'networking', defaultColor: '#FF9900' },
  { id: 'aws-elb', label: 'ELB', provider: 'aws', serviceType: 'Load Balancer', icon: 'aws-elb', category: 'networking', defaultColor: '#FF9900' },
  { id: 'aws-route53', label: 'Route 53', provider: 'aws', serviceType: 'DNS Service', icon: 'aws-route53', category: 'networking', defaultColor: '#FF9900' },
  { id: 'aws-vpc', label: 'VPC', provider: 'aws', serviceType: 'Virtual Private Cloud', icon: 'aws-vpc', category: 'networking', defaultColor: '#FF9900' },
  { id: 'aws-sns', label: 'SNS', provider: 'aws', serviceType: 'Simple Notification', icon: 'aws-sns', category: 'messaging', defaultColor: '#FF9900' },
  { id: 'aws-sqs', label: 'SQS', provider: 'aws', serviceType: 'Simple Queue', icon: 'aws-sqs', category: 'messaging', defaultColor: '#FF9900' },
  { id: 'aws-iam', label: 'IAM', provider: 'aws', serviceType: 'Identity & Access', icon: 'aws-iam', category: 'security', defaultColor: '#FF9900' },
  { id: 'aws-cognito', label: 'Cognito', provider: 'aws', serviceType: 'User Pool', icon: 'aws-cognito', category: 'security', defaultColor: '#FF9900' },
  { id: 'aws-kinesis', label: 'Kinesis', provider: 'aws', serviceType: 'Data Stream', icon: 'aws-kinesis', category: 'analytics', defaultColor: '#FF9900' },
  { id: 'aws-sagemaker', label: 'SageMaker', provider: 'aws', serviceType: 'ML Platform', icon: 'aws-sagemaker', category: 'ml', defaultColor: '#FF9900' },
];
