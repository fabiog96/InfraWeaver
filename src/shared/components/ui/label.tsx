import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import * as LabelPrimitive from '@radix-ui/react-label';

import { cn } from '@/shared/lib/utils';

const Label = forwardRef<
  HTMLLabelElement,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'text-[11px] font-medium leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
      className,
    )}
    {...props}
  />
));
Label.displayName = 'Label';

export { Label };
