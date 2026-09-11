import { useEffect } from 'react';
import { useReactFlow, type ReactFlowInstance } from '@xyflow/react';

import { syncFlowElements } from '../layout/flow-sync';
import { useVisualizerStore } from '../stores/visualizerStore';
import { useGitHubStore } from '../stores/githubStore';

const FIT_VIEW_OPTIONS = { duration: 300, padding: 0.15 };

const fitViewAfterNextRender = (reactFlow: ReactFlowInstance): void => {
  requestAnimationFrame(() => reactFlow.fitView(FIT_VIEW_OPTIONS));
};

/** Reacts to project/subproject selection and recomputes the flow elements. */
export const useProjectVisualization = () => {
  const graphNodes = useVisualizerStore((s) => s.graphNodes);
  const graphEdges = useVisualizerStore((s) => s.graphEdges);
  const projectCatalog = useVisualizerStore((s) => s.projectCatalog);
  const selectedProject = useVisualizerStore((s) => s.selectedProject);
  const selectedSubproject = useVisualizerStore((s) => s.selectedSubproject);
  const selectedModule = useVisualizerStore((s) => s.selectedModule);
  const expandedModuleId = useVisualizerStore((s) => s.expandedModuleId);
  const setFlowElements = useVisualizerStore((s) => s.setFlowElements);
  const setLayoutError = useVisualizerStore((s) => s.setLayoutError);
  const reactFlow = useReactFlow();

  const owner = useGitHubStore((s) => s.owner);
  const repo = useGitHubStore((s) => s.repo);
  const branch = useGitHubStore((s) => s.selectedBranch);

  useEffect(() => {
    if (graphNodes.length === 0 || !projectCatalog) return;

    const laidOut = syncFlowElements(
      {
        graphNodes,
        graphEdges,
        catalog: projectCatalog,
        selectedProject,
        selectedSubproject,
        selectedModule,
        expandedModuleId,
        positionKey: `${owner}/${repo}/${branch}/${selectedProject ?? 'all'}`,
        branch,
      },
      { setFlowElements, setLayoutError },
    );

    if (laidOut) fitViewAfterNextRender(reactFlow);
  }, [
    graphNodes, graphEdges, projectCatalog,
    selectedProject, selectedSubproject, selectedModule, expandedModuleId,
    owner, repo, branch, setFlowElements, setLayoutError, reactFlow,
  ]);
};
