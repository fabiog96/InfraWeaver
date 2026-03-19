import type { TerraformModule } from '../types';

import { awsLambdaModule } from './modules/aws-lambda';
import { awsDynamodbModule } from './modules/aws-dynamodb';
import { awsS3Module } from './modules/aws-s3';
import { awsVpcModule } from './modules/aws-vpc';
import { awsRdsModule } from './modules/aws-rds';
import { awsApiGatewayModule } from './modules/aws-api-gateway';
import { awsEcsModule } from './modules/aws-ecs';
import { awsEksModule } from './modules/aws-eks';
import { awsEc2Module } from './modules/aws-ec2';
import { awsCloudfrontModule } from './modules/aws-cloudfront';
import { awsCognitoModule } from './modules/aws-cognito';
import { awsSqsModule } from './modules/aws-sqs';
import { awsSnsModule } from './modules/aws-sns';
import { awsIamModule } from './modules/aws-iam';
import { awsElbModule } from './modules/aws-elb';
import { awsRoute53Module } from './modules/aws-route53';
import { awsElasticacheModule } from './modules/aws-elasticache';
import { awsKinesisModule } from './modules/aws-kinesis';
import { awsSagemakerModule } from './modules/aws-sagemaker';

export const moduleRegistry: Record<string, TerraformModule> = {
  'aws-lambda': awsLambdaModule,
  'aws-dynamodb': awsDynamodbModule,
  'aws-s3': awsS3Module,
  'aws-vpc': awsVpcModule,
  'aws-rds': awsRdsModule,
  'aws-api-gateway': awsApiGatewayModule,
  'aws-ecs': awsEcsModule,
  'aws-eks': awsEksModule,
  'aws-ec2': awsEc2Module,
  'aws-cloudfront': awsCloudfrontModule,
  'aws-cognito': awsCognitoModule,
  'aws-sqs': awsSqsModule,
  'aws-sns': awsSnsModule,
  'aws-iam': awsIamModule,
  'aws-elb': awsElbModule,
  'aws-route53': awsRoute53Module,
  'aws-elasticache': awsElasticacheModule,
  'aws-kinesis': awsKinesisModule,
  'aws-sagemaker': awsSagemakerModule,
};

export const getModule = (serviceId: string): TerraformModule | null => {
  return moduleRegistry[serviceId] ?? null;
};
