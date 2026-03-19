import { memo } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react';
import { RxCross2 } from 'react-icons/rx';

import { useDiagramStore } from '@/stores';
import { useEdgeValidation } from '@/features/codegen/stores/validationStore';

const RawSmartEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  data,
}: EdgeProps) => {
  const edgeData = data as { label?: string; lineStyle?: 'solid' | 'dashed' | 'dotted' } | undefined;
  const labelText = edgeData?.label;
  const lineStyle = edgeData?.lineStyle || 'solid';

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 12,
  });

  const validationStatus = useEdgeValidation(id);

  const setEdges = useDiagramStore((s) => s.setEdges);
  const edges = useDiagramStore((s) => s.edges);

  const handleDelete = () => {
    setEdges(edges.filter((e) => e.id !== id));
  };

  const strokeColor = validationStatus === 'error'
    ? 'var(--destructive)'
    : validationStatus === 'warning'
      ? 'var(--warning)'
      : selected ? 'var(--primary)' : 'var(--muted-foreground)';

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth: selected ? 2 : 1.5,
          strokeDasharray: lineStyle === 'dashed' ? '5,5' : lineStyle === 'dotted' ? '2,4' : 'none',
          transition: 'stroke 0.15s, stroke-width 0.15s',
        }}
      />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan pointer-events-auto absolute flex items-center gap-1"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          {labelText && (
            <span className="rounded-md bg-card px-1.5 py-0.5 text-[10px] text-muted-foreground border border-border/40">
              {labelText}
            </span>
          )}
          {selected && (
            <button
              onClick={handleDelete}
              className="flex h-4 w-4 items-center justify-center rounded-full bg-destructive/90 text-destructive-foreground transition-colors duration-150 hover:bg-destructive"
            >
              <RxCross2 className="h-2.5 w-2.5" />
            </button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export const SmartEdge = memo(RawSmartEdge);
