import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import { NodeResizer } from '@xyflow/react';

import type { GroupNodeData } from '@/shared/types';
import { cn } from '@/shared/lib/utils';

const RawGroupNode = ({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as GroupNodeData;

  return (
    <div
      className={cn(
        'relative h-full min-h-[200px] min-w-[300px] rounded-xl border-2 border-dashed p-4 transition-colors duration-150',
        selected ? 'border-primary/50' : 'border-border/40',
      )}
      style={{ borderColor: nodeData.color + '50' }}
    >
      <NodeResizer
        color={nodeData.color}
        isVisible={selected}
        minWidth={300}
        minHeight={200}
      />
      <div className="absolute -top-3 left-3 flex items-center gap-1.5 rounded-md bg-card px-2 py-0.5 border border-border/50">
        <span
          className="text-[11px] font-medium"
          style={{ color: nodeData.color }}
        >
          {nodeData.label}
        </span>
        {nodeData.folderName && (
          <span className="text-[9px] font-mono text-muted-foreground">
            /{nodeData.folderName}
          </span>
        )}
      </div>
    </div>
  );
};

export const GroupNode = memo(RawGroupNode);
