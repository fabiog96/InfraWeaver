import type { HTMLAttributes } from 'react';

import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';
import { badgeVariants } from './badge-variants';

interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

const Badge = ({ className, variant, ...props }: BadgeProps) => {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
};

export { Badge, type BadgeProps };
