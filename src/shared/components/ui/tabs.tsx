import {
  createContext, useContext, useState,
  forwardRef, type HTMLAttributes, type ButtonHTMLAttributes,
} from 'react';

import { cn } from '@/shared/lib/utils';

const TabsContext = createContext<{ value: string; onChange: (v: string) => void }>({
  value: '',
  onChange: () => {},
});

interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (v: string) => void;
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ defaultValue = '', value: controlledValue, onValueChange, className, ...props }, ref) => {
    const [internal, setInternal] = useState(defaultValue);
    const value = controlledValue ?? internal;
    const onChange = (v: string) => {
      setInternal(v);
      onValueChange?.(v);
    };

    return (
      <TabsContext.Provider value={{ value, onChange }}>
        <div ref={ref} className={cn('', className)} {...props} />
      </TabsContext.Provider>
    );
  },
);
Tabs.displayName = 'Tabs';

const TabsList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="tablist"
      className={cn(
        'inline-flex h-8 items-center gap-0.5 rounded-lg bg-secondary/50 p-1 text-muted-foreground',
        className,
      )}
      {...props}
    />
  ),
);
TabsList.displayName = 'TabsList';

interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, ...props }, ref) => {
    const ctx = useContext(TabsContext);
    const active = ctx.value === value;

    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        aria-selected={active}
        onClick={() => ctx.onChange(value)}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors duration-150 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40',
          active && 'bg-card text-primary',
          className,
        )}
        {...props}
      />
    );
  },
);
TabsTrigger.displayName = 'TabsTrigger';

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const ctx = useContext(TabsContext);
    if (ctx.value !== value) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        className={cn('mt-1.5 focus-visible:outline-none', className)}
        {...props}
      />
    );
  },
);
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
