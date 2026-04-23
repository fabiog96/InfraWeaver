import {
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';

import { useVisualizerStore } from '../stores/visualizerStore';

interface VizEdgeData {
  label?: string;
  edgeType?: 'explicit' | 'implicit' | 'terragrunt' | 'ghost';
}

/**
 * Read-only edge for the Visualizer canvas.
 *
 * Edges are dimmed by default (opacity 0.08) and only highlight when
 * connected to the currently selected node — keeps dense graphs readable.
 */
const RawVizEdge = ({
  id,
  source,
  target,
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

  const selectedNodeId = useVisualizerStore((s) => s.selectedNodeId);
  const isConnectedToSelection = selectedNodeId !== null
    && (source === selectedNodeId || target === selectedNodeId);

  const isHighlighted = selected || isConnectedToSelection;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const isGhost = edgeType === 'ghost';

  const strokeDasharray = isGhost ? '6,8' : 'none';
  const strokeColor = isHighlighted ? 'var(--foreground)' : isGhost ? 'var(--muted-foreground)' : 'var(--foreground)';
  const strokeOpacity = isHighlighted ? 1 : isGhost ? 0.15 : 0.08;

  const showLabel = labelText && isHighlighted;

  return (
    <>
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={isHighlighted ? 2.5 : 1.5}
        strokeDasharray={strokeDasharray}
        opacity={strokeOpacity}
        style={{ transition: 'stroke 0.15s, stroke-width 0.15s, opacity 0.15s' }}
      />
      {showLabel && (
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

export const VizEdge = RawVizEdge;
