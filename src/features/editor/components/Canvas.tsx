import { useCallback } from 'react';

import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useReactFlow,
  type NodeMouseHandler,
  type EdgeMouseHandler,
  type Node,
} from '@xyflow/react';

import { useDiagramStore } from '@/stores';
import { nodeTypes } from '../nodes';
import { edgeTypes } from '../edges';
import { useDragToCanvas } from '@/features/library/hooks';
import { usePackagedModuleDrop } from '@/features/packaged-modules/hooks';

export const Canvas = () => {
  const nodes = useDiagramStore((s) => s.nodes);
  const edges = useDiagramStore((s) => s.edges);
  const onNodesChange = useDiagramStore((s) => s.onNodesChange);
  const onEdgesChange = useDiagramStore((s) => s.onEdgesChange);
  const onConnect = useDiagramStore((s) => s.onConnect);
  const setSelectedNode = useDiagramStore((s) => s.setSelectedNode);
  const setSelectedEdge = useDiagramStore((s) => s.setSelectedEdge);
  const setNodeParent = useDiagramStore((s) => s.setNodeParent);

  const { getIntersectingNodes } = useReactFlow();
  const { onDragOver, onDrop } = useDragToCanvas();
  const { dropModule } = usePackagedModuleDrop();

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      setSelectedNode(node.id);
    },
    [setSelectedNode],
  );

  const onEdgeClick: EdgeMouseHandler = useCallback(
    (_event, edge) => {
      setSelectedEdge(edge.id);
    },
    [setSelectedEdge],
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, [setSelectedNode, setSelectedEdge]);

  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (node.type === 'group') return;

      const intersecting = getIntersectingNodes(node);
      const groupNode = intersecting.find((n) => n.type === 'group');

      if (groupNode && groupNode.id !== node.parentId) {
        setNodeParent(node.id, groupNode.id);
      } else if (!groupNode && node.parentId) {
        setNodeParent(node.id, undefined);
      }
    },
    [getIntersectingNodes, setNodeParent],
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onNodeDragStop={onNodeDragStop}
        onDragOver={onDragOver}
        onDrop={(event) => {
          if (event.dataTransfer.types.includes('application/archdiagram-module')) {
            dropModule(event);
          } else {
            onDrop(event);
          }
        }}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: 'smart', animated: false }}
        snapToGrid
        snapGrid={[16, 16]}
        fitView
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Shift"
        proOptions={{ hideAttribution: true }}
        className="bg-background"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color="var(--muted-foreground)"
        />
        <Controls
          position="bottom-left"
          showInteractive={false}
        />
        <MiniMap
          position="bottom-right"
          zoomable
          pannable
          nodeColor={() => 'var(--primary)'}
          maskColor="rgba(0, 0, 0, 0.7)"
        />
      </ReactFlow>
    </div>
  );
};
