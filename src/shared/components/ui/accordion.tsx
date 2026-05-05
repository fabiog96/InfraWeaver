import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { RxChevronDown } from 'react-icons/rx';

import { cn } from '@/shared/lib/utils';

interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple';
  defaultValue?: string[];
  value?: string[];
}

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, type, defaultValue, value, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  ),
);
Accordion.displayName = 'Accordion';

interface AccordionItemProps extends HTMLAttributes<HTMLDetailsElement> {
  value?: string;
}

const AccordionItem = forwardRef<HTMLDetailsElement, AccordionItemProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, value, ...props }, ref) => (
    <details ref={ref} open className={cn('border-b border-border/50 group', className)} {...props} />
  ),
);
AccordionItem.displayName = 'AccordionItem';

interface AccordionTriggerProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

const AccordionTrigger = forwardRef<HTMLElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <summary
      ref={ref as React.Ref<HTMLElement>}
      className={cn(
        'flex cursor-pointer list-none items-center justify-between py-2 text-xs font-medium transition-colors duration-150 hover:text-primary [&::-webkit-details-marker]:hidden',
        className,
      )}
      {...props}
    >
      {children}
      <RxChevronDown className="h-3 w-3 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
    </summary>
  ),
);
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('overflow-hidden text-xs', className)} {...props}>
      <div className={cn('pb-2 pt-0')}>{children}</div>
    </div>
  ),
);
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
