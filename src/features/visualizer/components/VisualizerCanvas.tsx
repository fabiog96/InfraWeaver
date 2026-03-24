import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type NodeTypes,
  type EdgeTypes,
} from '@xyflow/react';

import { useVisualizerStore } from '../stores/visualizerStore';
import { VizNode } from './VizNode';
import { VizEdge } from './VizEdge';
import { VizGroup } from './VizGroup';

const nodeTypes: NodeTypes = {
  vizNode: VizNode,
  vizGroup: VizGroup,
};

const edgeTypes: EdgeTypes = {
  vizEdge: VizEdge,
};

/**
 * Read-only React Flow canvas for the Visualizer (D5).
 *
 * Permitted interactions:
 * - Zoom / pan
 * - Click node to select (opens inspector)
 * - Drag nodes to reposition (positions are persisted via D7)
 *
 * Blocked interactions:
 * - No node creation (nodesConnectable=false)
 * - No edge creation (no connect handlers)
 * - No deletion (deleteKeyCode=null)
 */
export const VisualizerCanvas = () => {
  const flowNodes = useVisualizerStore((s) => s.flowNodes);
  const flowEdges = useVisualizerStore((s) => s.flowEdges);
  const onNodesChange = useVisualizerStore((s) => s.onNodesChange);
  const setSelectedNode = useVisualizerStore((s) => s.setSelectedNode);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      setSelectedNode(node.id);
    },
    [setSelectedNode],
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  const defaultEdgeOptions = useMemo(() => ({
    animated: false,
  }), []);

  return (
    <ReactFlow
      nodes={flowNodes}
      edges={flowEdges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={onNodesChange}
      onNodeClick={onNodeClick}
      onPaneClick={onPaneClick}
      defaultEdgeOptions={defaultEdgeOptions}
      nodesConnectable={false}
      nodesDraggable={true}
      elementsSelectable={true}
      deleteKeyCode={null}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.1}
      maxZoom={2}
    >
      <Background gap={20} size={1} />
      <Controls showInteractive={false} />
      <MiniMap
        nodeStrokeWidth={3}
        pannable
        zoomable
      />
    </ReactFlow>
  );
};
