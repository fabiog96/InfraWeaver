import { forwardRef, type ButtonHTMLAttributes } from 'react';

import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';
import { buttonVariants } from './button-variants';

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, variant, size, asChild, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

export { Button, type ButtonProps };
