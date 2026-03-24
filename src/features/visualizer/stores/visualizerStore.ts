import { create } from 'zustand';
import { applyNodeChanges, type OnNodesChange, type Node, type Edge } from '@xyflow/react';

import type { GraphNode, GraphEdge } from '../resolver/types';
import type { ParseError, ParseStats } from '../parser/types';

export type GroupByMode = 'project' | 'layer' | 'flat';

interface VisualizerState {
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  flowNodes: Node[];
  flowEdges: Edge[];
  errors: ParseError[];
  stats: ParseStats | null;
  selectedNodeId: string | null;
  groupBy: GroupByMode;
  searchQuery: string;

  setGraph: (nodes: GraphNode[], edges: GraphEdge[]) => void;
  setFlowElements: (nodes: Node[], edges: Edge[]) => void;
  setErrors: (errors: ParseError[]) => void;
  setStats: (stats: ParseStats) => void;
  setSelectedNode: (id: string | null) => void;
  setGroupBy: (mode: GroupByMode) => void;
  setSearchQuery: (query: string) => void;
  onNodesChange: OnNodesChange<Node>;
  clearVisualizer: () => void;
}

/**
 * Independent store for the Visualizer feature (D2).
 * Completely separated from diagramStore — the two modes share no state.
 * Manages the parsed graph data, React Flow elements, selection, grouping, and search.
 */
export const useVisualizerStore = create<VisualizerState>((set, get) => ({
  graphNodes: [],
  graphEdges: [],
  flowNodes: [],
  flowEdges: [],
  errors: [],
  stats: null,
  selectedNodeId: null,
  groupBy: 'project',
  searchQuery: '',

  setGraph: (graphNodes, graphEdges) => set({ graphNodes, graphEdges }),

  setFlowElements: (flowNodes, flowEdges) => set({ flowNodes, flowEdges }),

  setErrors: (errors) => set({ errors }),

  setStats: (stats) => set({ stats }),

  setSelectedNode: (id) => set({ selectedNodeId: id }),

  setGroupBy: (groupBy) => set({ groupBy }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  /** Allows node dragging for repositioning while keeping the canvas read-only (D5). */
  onNodesChange: (changes) => {
    const allowed = changes.filter(
      (c) => c.type === 'position' || c.type === 'dimensions' || c.type === 'select',
    );
    if (allowed.length > 0) {
      set({ flowNodes: applyNodeChanges(allowed, get().flowNodes) });
    }
  },

  clearVisualizer: () =>
    set({
      graphNodes: [],
      graphEdges: [],
      flowNodes: [],
      flowEdges: [],
      errors: [],
      stats: null,
      selectedNodeId: null,
      searchQuery: '',
    }),
}));
