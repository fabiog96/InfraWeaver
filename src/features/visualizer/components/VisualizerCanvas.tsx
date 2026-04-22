import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type NodeTypes,
  type EdgeTypes,
  type Node,
} from '@xyflow/react';

import { useVisualizerStore } from '../stores/visualizerStore';
import { useGitHubStore } from '../stores/githubStore';
import { savePositions, loadPositions } from '../layout/position-persistence';
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
 * Read-only React Flow canvas for the Visualizer.
 *
 * - Click node → select (opens inspector)
 * - Double-click module node → expand/collapse module internals
 * - Drag nodes to reposition (persisted per project)
 */
export const VisualizerCanvas = () => {
  const flowNodes = useVisualizerStore((s) => s.flowNodes);
  const flowEdges = useVisualizerStore((s) => s.flowEdges);
  const onNodesChange = useVisualizerStore((s) => s.onNodesChange);
  const setSelectedNode = useVisualizerStore((s) => s.setSelectedNode);
  const setExpandedModule = useVisualizerStore((s) => s.setExpandedModule);
  const selectedProject = useVisualizerStore((s) => s.selectedProject);

  const owner = useGitHubStore((s) => s.owner);
  const repo = useGitHubStore((s) => s.repo);
  const branch = useGitHubStore((s) => s.selectedBranch);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      setSelectedNode(node.id);
    },
    [setSelectedNode],
  );

  /** Double-click on a module node → expand/collapse its internals. */
  const onNodeDoubleClick = useCallback(
    (_: React.MouseEvent, node: { id: string; data: Record<string, unknown> }) => {
      if (node.data.nodeType === 'module' && node.data.moduleSource) {
        setExpandedModule(node.data.moduleSource as string);
      }
    },
    [setExpandedModule],
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  /** Persists node positions to localStorage per project. */
  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (!owner || !repo || !branch) return;
      const posKey = `${owner}/${repo}/${branch}/${selectedProject ?? 'all'}`;
      const existing = loadPositions(posKey, branch);
      existing[node.id] = { x: node.position.x, y: node.position.y };
      savePositions(posKey, branch, existing);
    },
    [owner, repo, branch, selectedProject],
  );

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
      onNodeDoubleClick={onNodeDoubleClick}
      onNodeDragStop={onNodeDragStop}
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
