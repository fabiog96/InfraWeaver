import { memo } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react';

interface VizEdgeData {
  label?: string;
  edgeType?: 'explicit' | 'implicit' | 'terragrunt' | 'ghost';
}

/**
 * Read-only edge component for the Visualizer canvas (D5).
 * No delete button — edges reflect parsed dependencies, not user-created connections.
 *
 * Edge styles:
 * - explicit (solid): direct resource reference
 * - terragrunt (dashed): cross-layer Terragrunt dependency
 * - implicit (dotted): inferred dependency
 */
const RawVizEdge = ({
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
  const edgeData = data as VizEdgeData | undefined;
  const edgeType = edgeData?.edgeType ?? 'explicit';
  const labelText = edgeData?.label;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 12,
  });

  const strokeDasharray = edgeType === 'ghost'
    ? '4,6'
    : edgeType === 'terragrunt'
      ? '6,4'
      : edgeType === 'implicit'
        ? '2,4'
        : 'none';

  const strokeColor = edgeType === 'ghost'
    ? 'var(--muted-foreground)'
    : edgeType === 'terragrunt'
      ? 'var(--accent)'
      : selected
        ? 'var(--primary)'
        : 'var(--muted-foreground)';

  const strokeOpacity = edgeType === 'ghost' ? 0.3 : 1;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth: selected ? 2 : 1.5,
          strokeDasharray,
          opacity: strokeOpacity,
          transition: 'stroke 0.15s, stroke-width 0.15s',
        }}
      />
      {labelText && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan pointer-events-none absolute"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            <span className="rounded-md bg-card px-1.5 py-0.5 text-[9px] text-muted-foreground border border-border/40">
              {labelText}
            </span>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export const VizEdge = memo(RawVizEdge);
