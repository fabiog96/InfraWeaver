import { memo } from 'react';

import {
  TbServer, TbDatabase, TbCloud, TbNetwork,
  TbCpu, TbBucket, TbUsers, TbNote, TbAlignLeft,
  TbApi, TbDeviceMobile, TbBrowser,
  TbSmartHome, TbUserCode, TbUserShield, TbGlobe
} from 'react-icons/tb';

import { BsFiletypeJson } from 'react-icons/bs';
import { FaReact, FaLaptopCode } from 'react-icons/fa';

import { cn } from '@/shared/lib/utils';
import { AwsIcon } from './AwsIcon';

const genericIconMap: Record<string, React.ElementType> = {
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
  if (icon.startsWith('aws-')) {
    return <AwsIcon icon={icon} className={className} />;
  }

  const IconComponent = genericIconMap[icon] || TbCloud;
  return <IconComponent className={cn('text-foreground', className)} style={style} />;
};

export const ServiceIcon = memo(RawServiceIcon);
