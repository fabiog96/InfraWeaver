import { memo } from 'react';

import {
  TbServer, TbDatabase, TbBolt, TbWorld, TbShield,
  TbCloud, TbBox, TbNetwork, TbMail, TbContainer,
  TbBrain, TbChartBar, TbKey, TbStack2, TbRouter,
  TbCpu, TbBucket, TbUsers, TbLambda, TbNote
} from 'react-icons/tb';

import { BsFiletypeJson } from "react-icons/bs";
import { FaReact, FaLaptopCode} from "react-icons/fa";


import { cn } from '@/shared/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  'aws-ec2': TbServer,
  'aws-s3': TbBucket,
  'aws-rds': TbDatabase,
  'aws-lambda': TbLambda,
  'aws-dynamodb': TbDatabase,
  'aws-cloudfront': TbWorld,
  'aws-api-gateway': TbRouter,
  'aws-elb': TbNetwork,
  'aws-sns': TbMail,
  'aws-sqs': TbMail,
  'aws-ecs': TbContainer,
  'aws-eks': TbContainer,
  'aws-route53': TbWorld,
  'aws-vpc': TbShield,
  'aws-iam': TbKey,
  'aws-cognito': TbShield,
  'aws-elasticache': TbDatabase,
  'aws-kinesis': TbStack2,
  'aws-sagemaker': TbBrain,
  'azure-vm': TbServer,
  'azure-blob': TbBucket,
  'azure-sql': TbDatabase,
  'azure-functions': TbBolt,
  'azure-cosmos': TbDatabase,
  'azure-cdn': TbWorld,
  'azure-apim': TbRouter,
  'azure-lb': TbNetwork,
  'azure-aks': TbContainer,
  'azure-app-service': TbCloud,
  'azure-key-vault': TbKey,
  'azure-event-hub': TbMail,
  'gcp-compute': TbServer,
  'gcp-storage': TbBucket,
  'gcp-sql': TbDatabase,
  'gcp-functions': TbBolt,
  'gcp-firestore': TbDatabase,
  'gcp-cdn': TbWorld,
  'gcp-lb': TbNetwork,
  'gcp-gke': TbContainer,
  'gcp-app-engine': TbCloud,
  'gcp-cloud-run': TbBox,
  'gcp-pubsub': TbMail,
  'gcp-bigquery': TbChartBar,
  'generic-server': TbServer,
  'generic-database': TbDatabase,
  'generic-storage': TbBucket,
  'generic-network': TbNetwork,
  'generic-compute': TbCpu,
  'generic-computer': FaLaptopCode,
  'generic-users': TbUsers,
  'generic-react': FaReact,
  'generic-json': BsFiletypeJson,
  'generic-note': TbNote,
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
