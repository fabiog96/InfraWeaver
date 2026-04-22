import { memo } from 'react';

import {
  TbServer, TbDatabase, TbWorld, TbShield,
  TbCloud, TbNetwork, TbMail, TbContainer,
  TbBrain, TbChartBar, TbKey, TbStack2, TbRouter,
  TbCpu, TbBucket, TbUsers, TbLambda, TbNote,
  TbAlignLeft, TbRocket, TbServerBolt, TbCloudComputing,
  TbBrandDocker, TbDeviceFloppy, TbArchive, TbDeviceAnalytics,
  TbTopologyStar, TbPlugConnected, TbWebhook, TbShieldLock,
  TbFingerprint, TbLock, TbScan, TbEye, TbFileSearch,
  TbActivity, TbSearch, TbTransform, TbGitBranch,
  TbAutomation, TbSettingsAutomation, TbFileCode, TbCloudCog,
  TbApi, TbApiApp, TbSchema, TbWand, TbDeviceMobile,
  TbBrowser, TbSmartHome, TbUserCode, TbUserShield, TbGlobe
} from 'react-icons/tb';


import { BsFiletypeJson } from "react-icons/bs";
import { FaReact, FaLaptopCode} from "react-icons/fa";


import { cn } from '@/shared/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  // AWS — Compute
  'aws-ec2': TbServer,
  'aws-lambda': TbLambda,
  'aws-fargate': TbServerBolt,
  'aws-batch': TbStack2,
  'aws-lightsail': TbCloudComputing,
  'aws-elastic-beanstalk': TbRocket,
  // AWS — Containers
  'aws-ecs': TbContainer,
  'aws-eks': TbContainer,
  'aws-ecr': TbBrandDocker,
  // AWS — Storage
  'aws-s3': TbBucket,
  'aws-efs': TbDeviceFloppy,
  'aws-ebs': TbDeviceFloppy,
  'aws-glacier': TbArchive,
  'aws-backup': TbArchive,
  // AWS — Database
  'aws-rds': TbDatabase,
  'aws-dynamodb': TbDatabase,
  'aws-elasticache': TbDatabase,
  'aws-aurora': TbDatabase,
  'aws-redshift': TbDeviceAnalytics,
  'aws-neptune': TbSchema,
  'aws-documentdb': TbDatabase,
  // AWS — Networking
  'aws-cloudfront': TbWorld,
  'aws-api-gateway': TbRouter,
  'aws-elb': TbNetwork,
  'aws-route53': TbWorld,
  'aws-vpc': TbShield,
  'aws-nat-gateway': TbTopologyStar,
  'aws-transit-gateway': TbTopologyStar,
  'aws-direct-connect': TbPlugConnected,
  'aws-privatelink': TbLock,
  'aws-global-accelerator': TbRocket,
  // AWS — Messaging
  'aws-sns': TbMail,
  'aws-sqs': TbMail,
  'aws-mq': TbMail,
  // AWS — Integration
  'aws-eventbridge': TbWebhook,
  'aws-step-functions': TbGitBranch,
  'aws-appsync': TbApiApp,
  // AWS — Security
  'aws-iam': TbKey,
  'aws-cognito': TbUsers,
  'aws-waf': TbShieldLock,
  'aws-guardduty': TbScan,
  'aws-secrets-manager': TbFingerprint,
  'aws-kms': TbLock,
  'aws-acm': TbShieldLock,
  // AWS — Monitoring
  'aws-cloudwatch': TbActivity,
  'aws-xray': TbSearch,
  'aws-cloudtrail': TbEye,
  // AWS — Analytics
  'aws-kinesis': TbStack2,
  'aws-athena': TbFileSearch,
  'aws-glue': TbTransform,
  'aws-emr': TbCloudComputing,
  'aws-quicksight': TbChartBar,
  // AWS — ML
  'aws-sagemaker': TbBrain,
  'aws-bedrock': TbWand,
  // AWS — Developer Tools
  'aws-codepipeline': TbAutomation,
  'aws-codebuild': TbSettingsAutomation,
  'aws-codedeploy': TbRocket,
  // AWS — Management
  'aws-cloudformation': TbFileCode,
  'aws-systems-manager': TbCloudCog,
  'generic-server': TbServer,
  'generic-database': TbDatabase,
  'generic-storage': TbBucket,
  'generic-network': TbNetwork,
  'generic-compute': TbCpu,
  'generic-computer': FaLaptopCode,
  'generic-users': TbUsers,
  'generic-react': FaReact,
  'generic-json': BsFiletypeJson,
  'generic-mobile-app': TbDeviceMobile,
  'generic-web-app': TbBrowser,
  'generic-iot-device': TbSmartHome,
  'generic-external-api': TbApi,
  'generic-developer': TbUserCode,
  'generic-admin': TbUserShield,
  'generic-internet': TbGlobe,
  'generic-cloud': TbCloud,
  'generic-note': TbNote,
  'generic-text': TbAlignLeft
};

interface ServiceIconProps {
  icon: string;
  className?: string;
  style?: React.CSSProperties;
}

const RawServiceIcon = ({ icon, className, style }: ServiceIconProps) => {
  const IconComponent = iconMap[icon] || TbCloud;

  return <IconComponent className={cn('text-foreground', className)} style={style} />;
};

export const ServiceIcon = memo(RawServiceIcon);
