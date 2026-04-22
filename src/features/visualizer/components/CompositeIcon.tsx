import { memo } from 'react';

import { ServiceIcon } from '@/shared/icons/ServiceIcon';

interface CompositeIconProps {
  icons: string[];
  color: string;
  size?: string;
}

/**
 * Renders one or more service icons side by side with a "+" separator (D8).
 * Used for module nodes that wrap multiple AWS services.
 *
 * @example
 * // API Gateway + Lambda module:
 * <CompositeIcon icons={['aws-api-gateway', 'aws-lambda']} color="#FF9900" />
 * // Renders: [API GW icon] + [Lambda icon]
 *
 * // Single-service module:
 * <CompositeIcon icons={['aws-lambda']} color="#FF9900" />
 * // Renders: [Lambda icon] (no separator)
 */
const RawCompositeIcon = ({ icons, color, size = 'h-4 w-4' }: CompositeIconProps) => {
  if (icons.length === 1) {
    return <ServiceIcon icon={icons[0]} className={size} style={{ color }} />;
  }

  return (
    <div className="flex items-center gap-0.5">
      {icons.map((icon, i) => (
        <div key={icon} className="flex items-center">
          {i > 0 && <span className="mx-0.5 text-[8px] text-muted-foreground">+</span>}
          <ServiceIcon icon={icon} className={size} style={{ color }} />
        </div>
      ))}
    </div>
  );
};

export const CompositeIcon = memo(RawCompositeIcon);
