import { useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';

import type { GraphNode, GraphEdge } from '../resolver/types';
import { computeLayout, groupNodesByFile } from '../layout/auto-layout';
import { loadPositions } from '../layout/position-persistence';
import { useVisualizerStore } from '../stores/visualizerStore';
import { useGitHubStore } from '../stores/githubStore';

/**
 * Reacts to project/subproject selection and recomputes flow elements.
 *
 * - No project selected → show all nodes
 * - Project selected → filter to project resources + ghost nodes for cross-project edges
 * - Subproject selected → further filter to subproject resources
 * - Module internal nodes hidden by default (isModuleInternal)
 */
export const useProjectVisualization = () => {
  const graphNodes = useVisualizerStore((s) => s.graphNodes);
  const graphEdges = useVisualizerStore((s) => s.graphEdges);
  const projectCatalog = useVisualizerStore((s) => s.projectCatalog);
  const selectedProject = useVisualizerStore((s) => s.selectedProject);
  const selectedSubproject = useVisualizerStore((s) => s.selectedSubproject);
  const selectedModule = useVisualizerStore((s) => s.selectedModule);
  const expandedModuleId = useVisualizerStore((s) => s.expandedModuleId);
  const setFlowElements = useVisualizerStore((s) => s.setFlowElements);
  const reactFlow = useReactFlow();

  const owner = useGitHubStore((s) => s.owner);
  const repo = useGitHubStore((s) => s.repo);
  const branch = useGitHubStore((s) => s.selectedBranch);

  useEffect(() => {
    if (graphNodes.length === 0 || !projectCatalog) return;

    const buildAndLayout = async () => {
      const { visibleNodes, visibleEdges, ghostNodeIds } = filterForView(
        graphNodes,
        graphEdges,
        projectCatalog,
        selectedProject,
        selectedSubproject,
        selectedModule,
        expandedModuleId,
      );

      const repoKey = `${owner}/${repo}`;
      const posKey = `${repoKey}/${branch}/${selectedProject ?? 'all'}`;
      const savedPositions = loadPositions(posKey, branch);
      const { nodes: flatNodes, edges: flowEdges } = computeLayout(
        visibleNodes, visibleEdges, savedPositions,
      );

      const flowNodes = groupNodesByFile(flatNodes, ghostNodeIds);

      setFlowElements(flowNodes, flowEdges);

      // Auto-fit canvas to show all new nodes after a tick (React Flow needs to render first)
      requestAnimationFrame(() => {
        reactFlow.fitView({ duration: 300, padding: 0.15 });
      });
    };

    buildAndLayout();
  }, [
    graphNodes, graphEdges, projectCatalog,
    selectedProject, selectedSubproject, selectedModule, expandedModuleId,
    owner, repo, branch, setFlowElements, reactFlow,
  ]);
};

/**
 * Filters graph nodes/edges based on the current project/subproject selection.
 * Includes ghost nodes for cross-project connections.
 */
const filterForView = (
  allNodes: GraphNode[],
  allEdges: GraphEdge[],
  catalog: import('../discovery/types').ProjectCatalog,
  selectedProject: string | null,
  selectedSubproject: string | null,
  selectedModule: string | null,
  expandedModuleId: string | null,
): { visibleNodes: GraphNode[]; visibleEdges: GraphEdge[]; ghostNodeIds: Set<string> } => {
  // Module selected → show its internal resources
  if (selectedModule) {
    const moduleInfo = catalog.modules.get(selectedModule);
    if (!moduleInfo) return { visibleNodes: [], visibleEdges: [], ghostNodeIds: new Set() };

    const moduleIds = new Set(moduleInfo.internalResourceIds);
    const visible = allNodes.filter((n) => moduleIds.has(n.id));
    const visibleIds = new Set(visible.map((n) => n.id));
    const edges = allEdges.filter((e) => visibleIds.has(e.source) && visibleIds.has(e.target));
    return { visibleNodes: visible, visibleEdges: edges, ghostNodeIds: new Set() };
  }

  // No project selected → show all (hide module internals)
  if (!selectedProject) {
    const visible = allNodes.filter((n) => !n.isModuleInternal);
    const visibleIds = new Set(visible.map((n) => n.id));
    const edges = allEdges.filter((e) => visibleIds.has(e.source) && visibleIds.has(e.target));
    return { visibleNodes: visible, visibleEdges: edges, ghostNodeIds: new Set() };
  }

  // Get project resource IDs
  const projectInfo = catalog.projects.get(selectedProject);
  if (!projectInfo) {
    return { visibleNodes: [], visibleEdges: [], ghostNodeIds: new Set() };
  }

  let targetIds: Set<string>;
  if (selectedSubproject) {
    const subInfo = projectInfo.subprojects.find((s) => s.name === selectedSubproject);
    targetIds = new Set(subInfo?.resourceIds ?? []);
  } else {
    targetIds = new Set(projectInfo.resourceIds);
  }

  // Primary nodes: project resources (excluding module internals unless expanded)
  const primaryNodes = allNodes.filter((n) => {
    if (!targetIds.has(n.id)) return false;
    if (n.isModuleInternal && n.parentModule !== expandedModuleId) return false;
    return true;
  });

  // If a module is expanded, include its internal nodes
  if (expandedModuleId) {
    const moduleInfo = catalog.modules.get(expandedModuleId);
    if (moduleInfo) {
      const moduleInternalIds = new Set(moduleInfo.internalResourceIds);
      for (const node of allNodes) {
        if (moduleInternalIds.has(node.id) && !primaryNodes.some((n) => n.id === node.id)) {
          primaryNodes.push(node);
        }
      }
    }
  }

  const primaryIds = new Set(primaryNodes.map((n) => n.id));

  // Find cross-project edges (edges connecting primary nodes to external nodes)
  const ghostNodeIds = new Set<string>();
  const visibleEdges: GraphEdge[] = [];

  for (const edge of allEdges) {
    const sourceIn = primaryIds.has(edge.source);
    const targetIn = primaryIds.has(edge.target);

    if (sourceIn && targetIn) {
      visibleEdges.push(edge);
    } else if (sourceIn && !targetIn) {
      ghostNodeIds.add(edge.target);
      visibleEdges.push({ ...edge, type: 'ghost' });
    } else if (!sourceIn && targetIn) {
      ghostNodeIds.add(edge.source);
      visibleEdges.push({ ...edge, type: 'ghost' });
    }
  }

  // Ghost nodes: external nodes connected to the project
  const ghostNodes = allNodes
    .filter((n) => ghostNodeIds.has(n.id) && !primaryIds.has(n.id))
    .map((n) => ({ ...n }));

  return {
    visibleNodes: [...primaryNodes, ...ghostNodes],
    visibleEdges,
    ghostNodeIds,
  };
};
