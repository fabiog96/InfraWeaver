import { TbArrowUpRight } from 'react-icons/tb';

import type { ModuleOutput } from '@/features/codegen/types';

interface OutputsListProps {
  outputs: ModuleOutput[];
}

export const OutputsList = ({ outputs }: OutputsListProps) => {
  return (
    <div className="space-y-1.5">
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        Outputs
      </span>

      {outputs.map((output) => (
        <div key={output.name} className="flex items-start gap-2 rounded-md border border-border/30 bg-secondary/20 px-2 py-1.5">
          <TbArrowUpRight className="mt-0.5 h-3 w-3 shrink-0 text-primary/60" />
          <div className="min-w-0">
            <span className="block truncate text-xs font-mono text-foreground">{output.name}</span>
            <span className="block truncate text-[10px] text-muted-foreground">{output.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
