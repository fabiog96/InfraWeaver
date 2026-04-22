import { create } from 'zustand';
import { applyNodeChanges, type OnNodesChange, type Node, type Edge } from '@xyflow/react';

import type { GraphNode, GraphEdge } from '../resolver/types';
import type { ParseError, ParseStats } from '../parser/types';
import type { ProjectCatalog } from '../discovery/types';

interface VisualizerState {
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  flowNodes: Node[];
  flowEdges: Edge[];
  errors: ParseError[];
  stats: ParseStats | null;
  selectedNodeId: string | null;
  projectCatalog: ProjectCatalog | null;
  selectedProject: string | null;
  selectedSubproject: string | null;
  selectedModule: string | null;
  expandedModuleId: string | null;

  setGraph: (nodes: GraphNode[], edges: GraphEdge[]) => void;
  setFlowElements: (nodes: Node[], edges: Edge[]) => void;
  setErrors: (errors: ParseError[]) => void;
  setStats: (stats: ParseStats) => void;
  setSelectedNode: (id: string | null) => void;
  setProjectCatalog: (catalog: ProjectCatalog) => void;
  setSelectedProject: (project: string | null) => void;
  setSelectedSubproject: (subproject: string | null) => void;
  setSelectedModule: (moduleName: string | null) => void;
  setExpandedModule: (moduleId: string | null) => void;
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
  projectCatalog: null,
  selectedProject: null,
  selectedSubproject: null,
  selectedModule: null,
  expandedModuleId: null,

  setGraph: (graphNodes, graphEdges) => set({ graphNodes, graphEdges }),

  setFlowElements: (flowNodes, flowEdges) => set({ flowNodes, flowEdges }),

  setErrors: (errors) => set({ errors }),

  setStats: (stats) => set({ stats }),

  setSelectedNode: (id) => set({ selectedNodeId: id }),

  setProjectCatalog: (projectCatalog) => set({ projectCatalog }),

  setSelectedProject: (selectedProject) => set({
    selectedProject,
    selectedSubproject: null,
    selectedModule: null,
    selectedNodeId: null,
    expandedModuleId: null,
  }),

  setSelectedSubproject: (selectedSubproject) => set({
    selectedSubproject,
    selectedModule: null,
    selectedNodeId: null,
    expandedModuleId: null,
  }),

  setSelectedModule: (moduleName) => set((state) => ({
    selectedModule: state.selectedModule === moduleName ? null : moduleName,
    selectedProject: null,
    selectedSubproject: null,
    selectedNodeId: null,
    expandedModuleId: null,
  })),

  setExpandedModule: (moduleId) => set((state) => ({
    expandedModuleId: state.expandedModuleId === moduleId ? null : moduleId,
  })),

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
      projectCatalog: null,
      selectedProject: null,
      selectedSubproject: null,
      selectedModule: null,
      expandedModuleId: null,
    }),
}));
