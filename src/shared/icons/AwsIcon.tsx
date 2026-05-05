import { memo } from 'react';

import ec2 from 'aws-icons/icons/architecture-service/AmazonEC2.svg?raw';
import lambda from 'aws-icons/icons/architecture-service/AWSLambda.svg?raw';
import fargate from 'aws-icons/icons/architecture-service/AWSFargate.svg?raw';
import batch from 'aws-icons/icons/architecture-service/AWSBatch.svg?raw';
import lightsail from 'aws-icons/icons/architecture-service/AmazonLightsail.svg?raw';
import elasticBeanstalk from 'aws-icons/icons/architecture-service/AWSElasticBeanstalk.svg?raw';

import ecs from 'aws-icons/icons/architecture-service/AmazonElasticContainerService.svg?raw';
import eks from 'aws-icons/icons/architecture-service/AmazonElasticKubernetesService.svg?raw';
import ecr from 'aws-icons/icons/architecture-service/AmazonElasticContainerRegistry.svg?raw';

import s3 from 'aws-icons/icons/architecture-service/AmazonSimpleStorageService.svg?raw';
import efs from 'aws-icons/icons/architecture-service/AmazonEFS.svg?raw';
import ebs from 'aws-icons/icons/architecture-service/AmazonElasticBlockStore.svg?raw';
import glacier from 'aws-icons/icons/architecture-service/AmazonSimpleStorageServiceGlacier.svg?raw';
import backup from 'aws-icons/icons/architecture-service/AWSBackup.svg?raw';

import rds from 'aws-icons/icons/architecture-service/AmazonRDS.svg?raw';
import dynamodb from 'aws-icons/icons/architecture-service/AmazonDynamoDB.svg?raw';
import dynamodbStreams from 'aws-icons/icons/resource/AmazonDynamoDBStream.svg?raw';
import elasticache from 'aws-icons/icons/architecture-service/AmazonElastiCache.svg?raw';
import aurora from 'aws-icons/icons/architecture-service/AmazonAurora.svg?raw';
import redshift from 'aws-icons/icons/architecture-service/AmazonRedshift.svg?raw';
import neptune from 'aws-icons/icons/architecture-service/AmazonNeptune.svg?raw';
import documentdb from 'aws-icons/icons/architecture-service/AmazonDocumentDB.svg?raw';

import cloudfront from 'aws-icons/icons/architecture-service/AmazonCloudFront.svg?raw';
import apiGateway from 'aws-icons/icons/architecture-service/AmazonAPIGateway.svg?raw';
import elb from 'aws-icons/icons/architecture-service/ElasticLoadBalancing.svg?raw';
import route53 from 'aws-icons/icons/architecture-service/AmazonRoute53.svg?raw';
import vpc from 'aws-icons/icons/architecture-service/AmazonVirtualPrivateCloud.svg?raw';
import natGateway from 'aws-icons/icons/resource/AmazonVPCNATGateway.svg?raw';
import transitGateway from 'aws-icons/icons/architecture-service/AWSTransitGateway.svg?raw';
import directConnect from 'aws-icons/icons/architecture-service/AWSDirectConnect.svg?raw';
import privateLink from 'aws-icons/icons/architecture-service/AWSPrivateLink.svg?raw';
import globalAccelerator from 'aws-icons/icons/architecture-service/AWSGlobalAccelerator.svg?raw';

import sns from 'aws-icons/icons/architecture-service/AmazonSimpleNotificationService.svg?raw';
import sqs from 'aws-icons/icons/architecture-service/AmazonSimpleQueueService.svg?raw';
import mq from 'aws-icons/icons/architecture-service/AmazonMQ.svg?raw';
import snsTopic from 'aws-icons/icons/resource/AmazonSimpleNotificationServiceTopic.svg?raw';
import sqsQueue from 'aws-icons/icons/resource/AmazonSimpleQueueServiceQueue.svg?raw';

import eventbridge from 'aws-icons/icons/architecture-service/AmazonEventBridge.svg?raw';
import stepFunctions from 'aws-icons/icons/architecture-service/AWSStepFunctions.svg?raw';
import appSync from 'aws-icons/icons/architecture-service/AWSAppSync.svg?raw';
import s3Event from 'aws-icons/icons/resource/AmazonSimpleStorageServiceS3Standard.svg?raw';
import cloudwatchAlarm from 'aws-icons/icons/resource/AmazonCloudWatchAlarm.svg?raw';
import cloudwatchEvent from 'aws-icons/icons/resource/AmazonCloudWatchEventEventBased.svg?raw';
import cognitoTrigger from 'aws-icons/icons/architecture-service/AmazonCognito.svg?raw';
import eventbridgeRule from 'aws-icons/icons/resource/AmazonEventBridgeRule.svg?raw';
import eventbridgeScheduler from 'aws-icons/icons/resource/AmazonEventBridgeScheduler.svg?raw';

import iam from 'aws-icons/icons/architecture-service/AWSIdentityandAccessManagement.svg?raw';
import cognito from 'aws-icons/icons/architecture-service/AmazonCognito.svg?raw';
import waf from 'aws-icons/icons/architecture-service/AWSWAF.svg?raw';
import guardduty from 'aws-icons/icons/architecture-service/AmazonGuardDuty.svg?raw';
import secretsManager from 'aws-icons/icons/architecture-service/AWSSecretsManager.svg?raw';
import kms from 'aws-icons/icons/architecture-service/AWSKeyManagementService.svg?raw';
import acm from 'aws-icons/icons/architecture-service/AWSCertificateManager.svg?raw';

import cloudwatch from 'aws-icons/icons/architecture-service/AmazonCloudWatch.svg?raw';
import xray from 'aws-icons/icons/architecture-service/AWSXRay.svg?raw';
import cloudtrail from 'aws-icons/icons/architecture-service/AWSCloudTrail.svg?raw';

import kinesis from 'aws-icons/icons/architecture-service/AmazonKinesis.svg?raw';
import athena from 'aws-icons/icons/architecture-service/AmazonAthena.svg?raw';
import glue from 'aws-icons/icons/architecture-service/AWSGlue.svg?raw';
import emr from 'aws-icons/icons/architecture-service/AmazonEMR.svg?raw';
import quicksight from 'aws-icons/icons/architecture-service/AmazonQuickSuite.svg?raw';

import sagemaker from 'aws-icons/icons/architecture-service/AmazonSageMaker.svg?raw';
import bedrock from 'aws-icons/icons/architecture-service/AmazonBedrock.svg?raw';

import codepipeline from 'aws-icons/icons/architecture-service/AWSCodePipeline.svg?raw';
import codebuild from 'aws-icons/icons/architecture-service/AWSCodeBuild.svg?raw';
import codedeploy from 'aws-icons/icons/architecture-service/AWSCodeDeploy.svg?raw';

import cloudformation from 'aws-icons/icons/architecture-service/AWSCloudFormation.svg?raw';
import systemsManager from 'aws-icons/icons/architecture-service/AWSSystemsManager.svg?raw';

const svgMap: Record<string, string> = {
  'aws-ec2': ec2,
  'aws-lambda': lambda,
  'aws-fargate': fargate,
  'aws-batch': batch,
  'aws-lightsail': lightsail,
  'aws-elastic-beanstalk': elasticBeanstalk,
  'aws-ecs': ecs,
  'aws-eks': eks,
  'aws-ecr': ecr,
  'aws-s3': s3,
  'aws-efs': efs,
  'aws-ebs': ebs,
  'aws-glacier': glacier,
  'aws-backup': backup,
  'aws-rds': rds,
  'aws-dynamodb': dynamodb,
  'aws-dynamodb-streams': dynamodbStreams,
  'aws-elasticache': elasticache,
  'aws-aurora': aurora,
  'aws-redshift': redshift,
  'aws-neptune': neptune,
  'aws-documentdb': documentdb,
  'aws-cloudfront': cloudfront,
  'aws-api-gateway': apiGateway,
  'aws-elb': elb,
  'aws-route53': route53,
  'aws-vpc': vpc,
  'aws-nat-gateway': natGateway,
  'aws-transit-gateway': transitGateway,
  'aws-direct-connect': directConnect,
  'aws-privatelink': privateLink,
  'aws-global-accelerator': globalAccelerator,
  'aws-s3-event': s3Event,
  'aws-cloudwatch-alarm': cloudwatchAlarm,
  'aws-cloudwatch-event': cloudwatchEvent,
  'aws-cognito-trigger': cognitoTrigger,
  'aws-eventbridge-rule': eventbridgeRule,
  'aws-eventbridge-scheduler': eventbridgeScheduler,
  'aws-sns-topic': snsTopic,
  'aws-sqs-queue': sqsQueue,
  'aws-sns': sns,
  'aws-sqs': sqs,
  'aws-mq': mq,
  'aws-eventbridge': eventbridge,
  'aws-step-functions': stepFunctions,
  'aws-appsync': appSync,
  'aws-iam': iam,
  'aws-cognito': cognito,
  'aws-waf': waf,
  'aws-guardduty': guardduty,
  'aws-secrets-manager': secretsManager,
  'aws-kms': kms,
  'aws-acm': acm,
  'aws-cloudwatch': cloudwatch,
  'aws-xray': xray,
  'aws-cloudtrail': cloudtrail,
  'aws-kinesis': kinesis,
  'aws-athena': athena,
  'aws-glue': glue,
  'aws-emr': emr,
  'aws-quicksight': quicksight,
  'aws-sagemaker': sagemaker,
  'aws-bedrock': bedrock,
  'aws-codepipeline': codepipeline,
  'aws-codebuild': codebuild,
  'aws-codedeploy': codedeploy,
  'aws-cloudformation': cloudformation,
  'aws-systems-manager': systemsManager,
};

interface AwsIconProps {
  icon: string;
  className?: string;
}

const stripSvgSize = (raw: string) =>
  raw.replace(/<svg([^>]*)>/, (_, attrs: string) => {
    const cleaned = attrs
      .replace(/\s*width="[^"]*"/g, '')
      .replace(/\s*height="[^"]*"/g, '');
    return `<svg${cleaned} width="100%" height="100%">`;
  });

const RawAwsIcon = ({ icon, className }: AwsIconProps) => {
  const svg = svgMap[icon];
  if (!svg) return null;

  return (
    <div
      className={className}
      style={{ pointerEvents: 'none' }}
      dangerouslySetInnerHTML={{ __html: stripSvgSize(svg) }}
    />
  );
};

export const AwsIcon = memo(RawAwsIcon);
