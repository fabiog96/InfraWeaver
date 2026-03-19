import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import { Handle, Position } from '@xyflow/react';

import type { TechNodeData } from '@/shared/types';
import { cn } from '@/shared/lib/utils';
import { ServiceIcon } from '@/shared/icons/ServiceIcon';
import { useNodeValidation } from '@/features/codegen/stores/validationStore';

const statusColors: Record<string, string> = {
  healthy: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
  none: '',
};

const validationBorderColors: Record<string, string> = {
  error: 'ring-2 ring-error/40',
  warning: 'ring-2 ring-warning/30',
};

const RawTechNode = ({ id, data, selected }: NodeProps) => {
  const nodeData = data as unknown as TechNodeData;
  const validationStatus = useNodeValidation(id);

  return (
    <div
      className={cn(
        'relative min-w-[130px] rounded-lg border bg-card px-3 py-2 transition-colors duration-150',
        selected ? 'border-primary/60' : 'border-border',
        validationStatus && validationBorderColors[validationStatus],
      )}
      style={{ borderLeftColor: nodeData.color, borderLeftWidth: 3 }}
    >
      <Handle type="target" position={Position.Top} className="!bg-primary !border-background" />
      <Handle type="source" position={Position.Bottom} className="!bg-primary !border-background" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-primary !border-background" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-primary !border-background" />

      <div className="flex items-center gap-2">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
          style={{ backgroundColor: nodeData.color + '18', color: nodeData.color }}
        >
          <ServiceIcon icon={nodeData.icon} className="h-4.5 w-4.5" style={{ color: nodeData.color }} />
        </div>

        <div className="flex flex-col overflow-hidden">
          <span className="truncate text-xs font-medium text-foreground">
            {nodeData.label}
          </span>
          <span className="truncate text-[10px] text-muted-foreground">
            {nodeData.serviceType}
          </span>
        </div>

        {nodeData.status !== 'none' && (
          <div
            className={cn(
              'absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-card',
              statusColors[nodeData.status],
            )}
            title={nodeData.status}
          />
        )}
      </div>

      {nodeData.notes && (
        <p className="mt-1.5 line-clamp-2 text-[10px] leading-snug text-muted-foreground whitespace-pre-wrap">
          {nodeData.notes}
        </p>
      )}
    </div>
  );
};

export const TechNode = memo(RawTechNode);
