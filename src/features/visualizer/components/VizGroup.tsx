import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';

import { cn } from '@/shared/lib/utils';

interface VizGroupData extends Record<string, unknown> {
  label: string;
  color: string;
}

/**
 * Group node for the Visualizer canvas.
 * Visually wraps related nodes (by project or layer) with a dashed border and label.
 * Not resizable — size is computed by the layout engine based on children.
 */
const RawVizGroup = ({ data, selected }: NodeProps) => {
  const groupData = data as unknown as VizGroupData;

  return (
    <div
      className={cn(
        'relative h-full min-h-[200px] min-w-[300px] rounded-xl border-2 border-dashed p-4 transition-colors duration-150',
        selected ? 'border-primary/50' : 'border-border/40',
      )}
      style={{ borderColor: groupData.color + '50' }}
    >
      <div className="absolute -top-3 left-3 flex items-center gap-1.5 rounded-md bg-card px-2 py-0.5 border border-border/50">
        <span
          className="text-[11px] font-medium"
          style={{ color: groupData.color }}
        >
          {groupData.label}
        </span>
      </div>
    </div>
  );
};

export const VizGroup = memo(RawVizGroup);
