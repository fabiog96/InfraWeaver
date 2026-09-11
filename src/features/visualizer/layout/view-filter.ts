import type { ProjectCatalog, ProjectInfo } from '../discovery/types';
import type { GraphNode, GraphEdge } from '../resolver/types';

export interface ViewSelection {
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  catalog: ProjectCatalog;
  selectedProject: string | null;
  selectedSubproject: string | null;
  selectedModule: string | null;
  expandedModuleId: string | null;
}

export interface FilteredView {
  visibleNodes: GraphNode[];
  visibleEdges: GraphEdge[];
  ghostNodeIds: Set<string>;
}

const emptyView = (): FilteredView => ({
  visibleNodes: [],
  visibleEdges: [],
  ghostNodeIds: new Set(),
});

const selfContainedView = (visibleNodes: GraphNode[], allEdges: GraphEdge[]): FilteredView => {
  const visibleIds = new Set(visibleNodes.map((n) => n.id));

  return {
    visibleNodes,
    visibleEdges: allEdges.filter((e) => visibleIds.has(e.source) && visibleIds.has(e.target)),
    ghostNodeIds: new Set(),
  };
};

const moduleInternalsView = (
  { graphNodes, graphEdges, catalog }: ViewSelection,
  moduleId: string,
): FilteredView => {
  const moduleInfo = catalog.modules.get(moduleId);
  if (!moduleInfo) return emptyView();

  const internalIds = new Set(moduleInfo.internalResourceIds);

  return selfContainedView(graphNodes.filter((n) => internalIds.has(n.id)), graphEdges);
};

const wholeGraphView = ({ graphNodes, graphEdges }: ViewSelection): FilteredView =>
  selfContainedView(graphNodes.filter((n) => !n.isModuleInternal), graphEdges);

const selectedResourceIds = (
  projectInfo: ProjectInfo,
  selectedSubproject: string | null,
): Set<string> => {
  if (!selectedSubproject) return new Set(projectInfo.resourceIds);

  const subInfo = projectInfo.subprojects.find((s) => s.name === selectedSubproject);
  return new Set(subInfo?.resourceIds ?? []);
};

const primaryNodesOf = (selection: ViewSelection, targetIds: Set<string>): GraphNode[] => {
  const { graphNodes, catalog, expandedModuleId } = selection;
  const primaryNodes = graphNodes.filter(
    (n) => targetIds.has(n.id) && (!n.isModuleInternal || n.parentModule === expandedModuleId),
  );

  if (!expandedModuleId) return primaryNodes;

  const moduleInfo = catalog.modules.get(expandedModuleId);
  if (!moduleInfo) return primaryNodes;

  const alreadyIn = new Set(primaryNodes.map((n) => n.id));
  const internalIds = new Set(moduleInfo.internalResourceIds);
  const expandedInternals: GraphNode[] = [];

  for (const node of graphNodes) {
    if (!internalIds.has(node.id) || alreadyIn.has(node.id)) continue;

    alreadyIn.add(node.id);
    expandedInternals.push(node);
  }

  return [...primaryNodes, ...expandedInternals];
};

interface EdgePartition {
  visibleEdges: GraphEdge[];
  ghostNodeIds: Set<string>;
}

const edgesAroundSelection = (primaryIds: Set<string>, allEdges: GraphEdge[]): EdgePartition => {
  const ghostNodeIds = new Set<string>();
  const visibleEdges: GraphEdge[] = [];

  for (const edge of allEdges) {
    const sourceIn = primaryIds.has(edge.source);
    const targetIn = primaryIds.has(edge.target);

    if (sourceIn && targetIn) {
      visibleEdges.push(edge);
    } else if (sourceIn) {
      ghostNodeIds.add(edge.target);
      visibleEdges.push({ ...edge, type: 'ghost' });
    } else if (targetIn) {
      ghostNodeIds.add(edge.source);
      visibleEdges.push({ ...edge, type: 'ghost' });
    }
  }

  return { visibleEdges, ghostNodeIds };
};

const projectView = (selection: ViewSelection, projectName: string): FilteredView => {
  const projectInfo = selection.catalog.projects.get(projectName);
  if (!projectInfo) return emptyView();

  const targetIds = selectedResourceIds(projectInfo, selection.selectedSubproject);
  const primaryNodes = primaryNodesOf(selection, targetIds);
  const primaryIds = new Set(primaryNodes.map((n) => n.id));
  const { visibleEdges, ghostNodeIds } = edgesAroundSelection(primaryIds, selection.graphEdges);
  const ghostNodes = selection.graphNodes
    .filter((n) => ghostNodeIds.has(n.id) && !primaryIds.has(n.id))
    .map((n) => ({ ...n }));

  return { visibleNodes: [...primaryNodes, ...ghostNodes], visibleEdges, ghostNodeIds };
};

/** Narrows the whole graph down to what the current selection should show. */
export const filterForView = (selection: ViewSelection): FilteredView => {
  if (selection.selectedModule) return moduleInternalsView(selection, selection.selectedModule);
  if (!selection.selectedProject) return wholeGraphView(selection);

  return projectView(selection, selection.selectedProject);
};
