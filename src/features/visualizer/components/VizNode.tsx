import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import { Handle, Position } from '@xyflow/react';

import { cn } from '@/shared/lib/utils';
import { CompositeIcon } from './CompositeIcon';

interface VizNodeData extends Record<string, unknown> {
  label: string;
  serviceType: string;
  icons: string[];
  color: string;
  provider: string;
  nodeType: string;
  layer?: string;
  project?: string;
  isComposite: boolean;
}

/**
 * Read-only node component for the Visualizer canvas (D5).
 * Similar to TechNode but without editing capabilities.
 * Shows composite icons for module nodes (D8) and a "data" badge for data sources.
 * Handles are visible for edge routing but not connectable.
 */
const RawVizNode = ({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as VizNodeData;

  return (
    <div
      className={cn(
        'relative min-w-[140px] rounded-lg border bg-card px-3 py-2 transition-colors duration-150',
        selected ? 'border-primary/60' : 'border-border',
      )}
      style={{ borderLeftColor: nodeData.color, borderLeftWidth: 3 }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-primary !border-background"
        isConnectable={false}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-primary !border-background"
        isConnectable={false}
      />

      <div className="flex items-center gap-2">
        <div
          className="flex shrink-0 items-center justify-center rounded-md"
          style={{
            backgroundColor: nodeData.color + '18',
            width: nodeData.isComposite ? 'auto' : 32,
            height: 32,
            padding: nodeData.isComposite ? '0 6px' : 0,
          }}
        >
          <CompositeIcon icons={nodeData.icons} color={nodeData.color} />
        </div>

        <div className="flex flex-col overflow-hidden">
          <span className="truncate text-xs font-medium text-foreground">
            {nodeData.label}
          </span>
          <span className="truncate text-[10px] text-muted-foreground">
            {nodeData.serviceType}
          </span>
        </div>

        {nodeData.nodeType === 'data' && (
          <span className="absolute -top-1.5 -right-1.5 rounded bg-accent px-1 text-[8px] font-bold text-accent-foreground">
            DATA
          </span>
        )}
      </div>
    </div>
  );
};

export const VizNode = memo(RawVizNode);
