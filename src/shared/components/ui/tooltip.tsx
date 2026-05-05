import { type ReactNode, type HTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';

interface TooltipProviderProps {
  children: ReactNode;
  delayDuration?: number;
}

const TooltipProvider = ({ children }: TooltipProviderProps) => <>{children}</>;

const Tooltip = ({ children }: { children: ReactNode }) => (
  <div className="group/tooltip relative inline-flex">{children}</div>
);

interface TooltipTriggerProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TooltipTrigger = ({ children, asChild, ...props }: TooltipTriggerProps) => (
  <div {...props}>{children}</div>
);

interface TooltipContentProps extends HTMLAttributes<HTMLDivElement> {
  sideOffset?: number;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TooltipContent = ({ className, children, sideOffset, side, ...props }: TooltipContentProps) => (
  <div
    className={cn(
      'pointer-events-none absolute left-0 top-full z-50 mt-1.5 whitespace-nowrap rounded-lg border border-border bg-popover px-2.5 py-1.5 text-[11px] text-popover-foreground opacity-0 transition-opacity duration-150 group-hover/tooltip:opacity-100',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
