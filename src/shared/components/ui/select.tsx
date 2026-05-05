import {
  createContext, useContext, useState, useRef, useEffect, useCallback,
  forwardRef, type HTMLAttributes, type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

import { RxCheck, RxChevronDown } from 'react-icons/rx';

import { cn } from '@/shared/lib/utils';

interface SelectContextValue {
  value: string;
  onValueChange: (v: string) => void;
  open: boolean;
  setOpen: (o: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const SelectContext = createContext<SelectContextValue>({
  value: '',
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
  triggerRef: { current: null },
});

interface SelectProps {
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
}

const Select = ({ children, value: controlledValue, defaultValue = '', onValueChange }: SelectProps) => {
  const [internal, setInternal] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const value = controlledValue ?? internal;

  const handleChange = useCallback((v: string) => {
    setInternal(v);
    onValueChange?.(v);
    setOpen(false);
  }, [onValueChange]);

  return (
    <SelectContext.Provider value={{ value, onValueChange: handleChange, open, setOpen, triggerRef }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectGroup = ({ children }: { children: ReactNode }) => <>{children}</>;
const SelectValue = ({ placeholder }: { placeholder?: string; className?: string }) => {
  const { value } = useContext(SelectContext);
  return <span className="truncate">{value || placeholder}</span>;
};

const SelectTrigger = forwardRef<HTMLButtonElement, HTMLAttributes<HTMLButtonElement> & { children?: ReactNode }>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen, triggerRef } = useContext(SelectContext);

    return (
      <button
        ref={(node) => {
          if (triggerRef && 'current' in triggerRef) triggerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref && 'current' in ref) ref.current = node;
        }}
        type="button"
        role="combobox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={cn(
          'flex h-8 w-full items-center justify-between gap-1.5 overflow-hidden rounded-md border border-input bg-secondary/30 px-2.5 py-1.5 text-xs transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-40 [&>span]:truncate',
          className,
        )}
        {...props}
      >
        {children}
        <RxChevronDown className="h-3 w-3 shrink-0 opacity-50" />
      </button>
    );
  },
);
SelectTrigger.displayName = 'SelectTrigger';

const SelectContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { position?: string }>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, children, position, ...props }, ref) => {
    const { open, setOpen, triggerRef } = useContext(SelectContext);
    const contentRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

    useEffect(() => {
      if (!open || !triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 4, left: rect.right, width: rect.width });
    }, [open, triggerRef]);

    useEffect(() => {
      if (!open) return;

      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node;
        if (
          contentRef.current && !contentRef.current.contains(target) &&
          triggerRef.current && !triggerRef.current.contains(target)
        ) {
          setOpen(false);
        }
      };

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }, [open, setOpen, triggerRef]);

    if (!open) return null;

    return createPortal(
      <div
        ref={(node) => {
          if (contentRef && 'current' in contentRef) contentRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref && 'current' in ref) ref.current = node;
        }}
        style={{ position: 'fixed', top: coords.top, right: window.innerWidth - coords.left, minWidth: coords.width }}
        className={cn(
          'z-50 max-h-72 overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md',
          className,
        )}
        {...props}
      >
        {children}
      </div>,
      document.body,
    );
  },
);
SelectContent.displayName = 'SelectContent';

interface SelectItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, disabled, ...props }, ref) => {
    const ctx = useContext(SelectContext);
    const selected = ctx.value === value;

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={selected}
        aria-disabled={disabled}
        onClick={() => !disabled && ctx.onValueChange(value)}
        className={cn(
          'flex w-full cursor-default select-none items-center gap-1.5 rounded-md py-1 pl-2 pr-2 text-xs outline-none transition-colors duration-100 hover:bg-primary/10 hover:text-foreground',
          disabled && 'pointer-events-none opacity-40',
          className,
        )}
        {...props}
      >
        <span className="whitespace-nowrap">{children}</span>
        <span className="ml-auto flex h-3 w-3 shrink-0 items-center justify-center">
          {selected && <RxCheck className="h-3 w-3" />}
        </span>
      </div>
    );
  },
);
SelectItem.displayName = 'SelectItem';

const SelectSeparator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
  ),
);
SelectSeparator.displayName = 'SelectSeparator';

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectSeparator,
};
