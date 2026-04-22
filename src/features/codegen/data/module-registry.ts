import type { TerraformModule } from '../types';

// Compute
import { awsEc2Module } from './modules/aws-ec2';
import { awsLambdaModule } from './modules/aws-lambda';
import { awsFargateModule } from './modules/aws-fargate';
import { awsBatchModule } from './modules/aws-batch';
import { awsLightsailModule } from './modules/aws-lightsail';
import { awsElasticBeanstalkModule } from './modules/aws-elastic-beanstalk';

// Containers
import { awsEcsModule } from './modules/aws-ecs';
import { awsEksModule } from './modules/aws-eks';
import { awsEcrModule } from './modules/aws-ecr';

// Storage
import { awsS3Module } from './modules/aws-s3';
import { awsEfsModule } from './modules/aws-efs';
import { awsEbsModule } from './modules/aws-ebs';
import { awsGlacierModule } from './modules/aws-glacier';
import { awsBackupModule } from './modules/aws-backup';

// Database
import { awsRdsModule } from './modules/aws-rds';
import { awsDynamodbModule } from './modules/aws-dynamodb';
import { awsElasticacheModule } from './modules/aws-elasticache';
import { awsAuroraModule } from './modules/aws-aurora';
import { awsRedshiftModule } from './modules/aws-redshift';
import { awsNeptuneModule } from './modules/aws-neptune';
import { awsDocumentdbModule } from './modules/aws-documentdb';

// Networking
import { awsCloudfrontModule } from './modules/aws-cloudfront';
import { awsApiGatewayModule } from './modules/aws-api-gateway';
import { awsElbModule } from './modules/aws-elb';
import { awsRoute53Module } from './modules/aws-route53';
import { awsVpcModule } from './modules/aws-vpc';
import { awsNatGatewayModule } from './modules/aws-nat-gateway';
import { awsTransitGatewayModule } from './modules/aws-transit-gateway';
import { awsDirectConnectModule } from './modules/aws-direct-connect';
import { awsPrivatelinkModule } from './modules/aws-privatelink';
import { awsGlobalAcceleratorModule } from './modules/aws-global-accelerator';

// Messaging
import { awsSqsModule } from './modules/aws-sqs';
import { awsSnsModule } from './modules/aws-sns';
import { awsMqModule } from './modules/aws-mq';

// Integration
import { awsEventbridgeModule } from './modules/aws-eventbridge';
import { awsStepFunctionsModule } from './modules/aws-step-functions';
import { awsAppsyncModule } from './modules/aws-appsync';

// Security
import { awsIamModule } from './modules/aws-iam';
import { awsCognitoModule } from './modules/aws-cognito';
import { awsWafModule } from './modules/aws-waf';
import { awsGuarddutyModule } from './modules/aws-guardduty';
import { awsSecretsManagerModule } from './modules/aws-secrets-manager';
import { awsKmsModule } from './modules/aws-kms';
import { awsAcmModule } from './modules/aws-acm';

// Monitoring
import { awsCloudwatchModule } from './modules/aws-cloudwatch';
import { awsXrayModule } from './modules/aws-xray';
import { awsCloudtrailModule } from './modules/aws-cloudtrail';

// Analytics
import { awsKinesisModule } from './modules/aws-kinesis';
import { awsAthenaModule } from './modules/aws-athena';
import { awsGlueModule } from './modules/aws-glue';
import { awsEmrModule } from './modules/aws-emr';
import { awsQuicksightModule } from './modules/aws-quicksight';

// Machine Learning
import { awsSagemakerModule } from './modules/aws-sagemaker';
import { awsBedrockModule } from './modules/aws-bedrock';

// Developer Tools
import { awsCodepipelineModule } from './modules/aws-codepipeline';
import { awsCodebuildModule } from './modules/aws-codebuild';
import { awsCodedeployModule } from './modules/aws-codedeploy';

// Management
import { awsCloudformationModule } from './modules/aws-cloudformation';
import { awsSystemsManagerModule } from './modules/aws-systems-manager';

export const moduleRegistry: Record<string, TerraformModule> = {
  // Compute
  'aws-ec2': awsEc2Module,
  'aws-lambda': awsLambdaModule,
  'aws-fargate': awsFargateModule,
  'aws-batch': awsBatchModule,
  'aws-lightsail': awsLightsailModule,
  'aws-elastic-beanstalk': awsElasticBeanstalkModule,

  // Containers
  'aws-ecs': awsEcsModule,
  'aws-eks': awsEksModule,
  'aws-ecr': awsEcrModule,

  // Storage
  'aws-s3': awsS3Module,
  'aws-efs': awsEfsModule,
  'aws-ebs': awsEbsModule,
  'aws-glacier': awsGlacierModule,
  'aws-backup': awsBackupModule,

  // Database
  'aws-rds': awsRdsModule,
  'aws-dynamodb': awsDynamodbModule,
  'aws-elasticache': awsElasticacheModule,
  'aws-aurora': awsAuroraModule,
  'aws-redshift': awsRedshiftModule,
  'aws-neptune': awsNeptuneModule,
  'aws-documentdb': awsDocumentdbModule,

  // Networking
  'aws-cloudfront': awsCloudfrontModule,
  'aws-api-gateway': awsApiGatewayModule,
  'aws-elb': awsElbModule,
  'aws-route53': awsRoute53Module,
  'aws-vpc': awsVpcModule,
  'aws-nat-gateway': awsNatGatewayModule,
  'aws-transit-gateway': awsTransitGatewayModule,
  'aws-direct-connect': awsDirectConnectModule,
  'aws-privatelink': awsPrivatelinkModule,
  'aws-global-accelerator': awsGlobalAcceleratorModule,

  // Messaging
  'aws-sqs': awsSqsModule,
  'aws-sns': awsSnsModule,
  'aws-mq': awsMqModule,

  // Integration
  'aws-eventbridge': awsEventbridgeModule,
  'aws-step-functions': awsStepFunctionsModule,
  'aws-appsync': awsAppsyncModule,

  // Security
  'aws-iam': awsIamModule,
  'aws-cognito': awsCognitoModule,
  'aws-waf': awsWafModule,
  'aws-guardduty': awsGuarddutyModule,
  'aws-secrets-manager': awsSecretsManagerModule,
  'aws-kms': awsKmsModule,
  'aws-acm': awsAcmModule,

  // Monitoring
  'aws-cloudwatch': awsCloudwatchModule,
  'aws-xray': awsXrayModule,
  'aws-cloudtrail': awsCloudtrailModule,

  // Analytics
  'aws-kinesis': awsKinesisModule,
  'aws-athena': awsAthenaModule,
  'aws-glue': awsGlueModule,
  'aws-emr': awsEmrModule,
  'aws-quicksight': awsQuicksightModule,

  // Machine Learning
  'aws-sagemaker': awsSagemakerModule,
  'aws-bedrock': awsBedrockModule,

  // Developer Tools
  'aws-codepipeline': awsCodepipelineModule,
  'aws-codebuild': awsCodebuildModule,
  'aws-codedeploy': awsCodedeployModule,

  // Management
  'aws-cloudformation': awsCloudformationModule,
  'aws-systems-manager': awsSystemsManagerModule,
};

export const getModule = (serviceId: string): TerraformModule | null => {
  return moduleRegistry[serviceId] ?? null;
};
