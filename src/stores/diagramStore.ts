import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from '@xyflow/react';

import type { DiagramNode, DiagramEdge } from '@/shared/types';

// This store manages the state of the diagram, including nodes, edges, and selection.
interface DiagramState {
  nodes: DiagramNode[]; // all nodes in the diagram
  edges: DiagramEdge[]; // all edges in the diagram
  selectedNodeId: string | null; // currently selected node ID ( only one node can be selected at a time)
  selectedEdgeId: string | null; // currently selected edge ID 
  onNodesChange: OnNodesChange<DiagramNode>;
  onEdgesChange: OnEdgesChange<DiagramEdge>;
  onConnect: OnConnect;
  setSelectedNode: (id: string | null) => void;
  setSelectedEdge: (id: string | null) => void;
  addNode: (node: DiagramNode) => void;
  removeNode: (id: string) => void;
  removeEdge: (id: string) => void;
  updateNodeData: (id: string, data: Record<string, unknown>) => void;
  updateEdgeData: (id: string, data: Record<string, unknown>) => void;
  setNodeParent: (nodeId: string, parentId: string | undefined) => void;
  setNodes: (nodes: DiagramNode[]) => void;
  setEdges: (edges: DiagramEdge[]) => void;
  clearDiagram: () => void;
}

export const useDiagramStore = create<DiagramState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(
        {
          ...connection,
          type: 'smart',
          animated: true,
          data: { lineStyle: 'solid' }
        } as DiagramEdge,
        get().edges,
      ),
    });
  },

  setSelectedNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  setSelectedEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),

  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),

  removeNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    })),

  removeEdge: (id) =>
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== id),
      selectedEdgeId: state.selectedEdgeId === id ? null : state.selectedEdgeId,
    })),

  updateNodeData: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? ({ ...node, data: { ...node.data, ...data } } as DiagramNode)
          : node,
      ),
    })),

  updateEdgeData: (id, data) =>
    set((state) => ({
      edges: state.edges.map((edge) =>
        edge.id === id
          ? ({ ...edge, data: { ...edge.data, ...data } } as DiagramEdge)
          : edge,
      ),
    })),

  setNodeParent: (nodeId, parentId) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? ({ ...node, parentId, extent: parentId ? 'parent' as const : undefined } as DiagramNode)
          : node,
      ),
    })),

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  clearDiagram: () => set({ nodes: [], edges: [], selectedNodeId: null, selectedEdgeId: null }),
}));
