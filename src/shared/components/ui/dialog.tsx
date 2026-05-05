import {
  createContext, useContext, useRef, useEffect, useCallback, useState,
  forwardRef, type HTMLAttributes, type ReactNode, type MouseEvent,
} from 'react';

import { RxCross2 } from 'react-icons/rx';

import { cn } from '@/shared/lib/utils';

interface DialogContextValue {
  open: boolean;
  setOpen: (o: boolean) => void;
}

const DialogContext = createContext<DialogContextValue>({
  open: false,
  setOpen: () => {},
});

interface DialogProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Dialog = ({ children, open: controlledOpen, onOpenChange }: DialogProps) => {
  const [internal, setInternal] = useState(false);
  const open = controlledOpen ?? internal;

  const setOpen = useCallback((o: boolean) => {
    setInternal(o);
    onOpenChange?.(o);
  }, [onOpenChange]);

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

interface DialogTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DialogTrigger = ({ children, asChild, ...props }: DialogTriggerProps) => {
  const { setOpen } = useContext(DialogContext);
  return (
    <button type="button" onClick={() => setOpen(true)} {...props}>
      {children}
    </button>
  );
};

const DialogClose = ({ children, ...props }: HTMLAttributes<HTMLButtonElement>) => {
  const { setOpen } = useContext(DialogContext);
  return (
    <button type="button" onClick={() => setOpen(false)} {...props}>
      {children}
    </button>
  );
};

const DialogContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = useContext(DialogContext);
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!open) return;
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [open, setOpen]);

    if (!open) return null;

    const handleOverlayClick = (e: MouseEvent) => {
      if (e.target === e.currentTarget) setOpen(false);
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black/60 animate-in fade-in-0"
          onClick={handleOverlayClick}
        />
        <div
          ref={(node) => {
            (dialogRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          className={cn(
            'relative z-50 grid w-full max-w-md gap-4 rounded-xl border border-border bg-card p-5 animate-in fade-in-0 zoom-in-95',
            className,
          )}
          {...props}
        >
          {children}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-md p-1 opacity-50 transition-opacity duration-150 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring/30"
          >
            <RxCross2 className="h-3.5 w-3.5" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      </div>
    );
  },
);
DialogContent.displayName = 'DialogContent';

const DialogOverlay = () => null;

const DialogHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col gap-1 text-left', className)} {...props} />
);

const DialogFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);

const DialogTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn('text-sm font-semibold leading-none tracking-tight', className)} {...props} />
  ),
);
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-xs text-muted-foreground', className)} {...props} />
  ),
);
DialogDescription.displayName = 'DialogDescription';

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
