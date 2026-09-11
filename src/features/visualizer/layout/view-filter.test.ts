import { describe, expect, it } from 'vitest';

import type { ModuleDefinitionInfo, ProjectCatalog, ProjectInfo } from '../discovery/types';
import type { GraphEdge, GraphNode } from '../resolver/types';
import { filterForView, type ViewSelection } from './view-filter';

const graphNode = (overrides: Partial<GraphNode> & Pick<GraphNode, 'id'>): GraphNode => ({
  type: 'resource',
  provider: 'aws',
  serviceType: 'aws_s3_bucket',
  label: overrides.id,
  filePath: 'resources/storage.tf',
  lineStart: 1,
  ...overrides,
});

const graphEdge = (source: string, target: string): GraphEdge => ({
  id: `${source}->${target}`,
  source,
  target,
  label: 'depends on',
  type: 'explicit',
});

const projectInfo = (overrides: Partial<ProjectInfo> & Pick<ProjectInfo, 'name'>): ProjectInfo => ({
  resourceCount: overrides.resourceIds?.length ?? 0,
  resourceIds: [],
  subprojects: [],
  layers: [],
  ...overrides,
});

const moduleInfo = (
  overrides: Partial<ModuleDefinitionInfo> & Pick<ModuleDefinitionInfo, 'name'>,
): ModuleDefinitionInfo => ({
  sourcePath: `modules/${overrides.name}`,
  internalResourceIds: [],
  internalResourceTypes: [],
  usedByProjects: [],
  usedByCount: 0,
  ...overrides,
});

const catalogOf = (projects: ProjectInfo[], modules: ModuleDefinitionInfo[]): ProjectCatalog => ({
  projects: new Map(projects.map((p) => [p.name, p])),
  modules: new Map(modules.map((m) => [m.name, m])),
  untaggedResourceIds: [],
  totalTagged: 0,
  totalUntagged: 0,
});

const selection = (overrides: Partial<ViewSelection>): ViewSelection => ({
  graphNodes: [],
  graphEdges: [],
  catalog: catalogOf([], []),
  selectedProject: null,
  selectedSubproject: null,
  selectedModule: null,
  expandedModuleId: null,
  ...overrides,
});

const idsOf = (nodes: GraphNode[]): string[] => nodes.map((n) => n.id);

describe('filterForView — nothing selected', () => {
  it('shows every node but the ones living inside a module', () => {
    const view = filterForView(selection({
      graphNodes: [
        graphNode({ id: 'resource.a' }),
        graphNode({ id: 'resource.inner', isModuleInternal: true, parentModule: 'module.m' }),
      ],
    }));

    expect(idsOf(view.visibleNodes)).toEqual(['resource.a']);
  });

  it('drops the edges that point at a hidden node', () => {
    const view = filterForView(selection({
      graphNodes: [
        graphNode({ id: 'resource.a' }),
        graphNode({ id: 'resource.b' }),
        graphNode({ id: 'resource.inner', isModuleInternal: true }),
      ],
      graphEdges: [graphEdge('resource.a', 'resource.b'), graphEdge('resource.a', 'resource.inner')],
    }));

    expect(view.visibleEdges.map((e) => e.id)).toEqual(['resource.a->resource.b']);
    expect(view.ghostNodeIds.size).toBe(0);
  });
});

describe('filterForView — a module is selected', () => {
  const catalog = catalogOf([], [
    moduleInfo({ name: 'module.m', internalResourceIds: ['resource.inner'] }),
  ]);

  it('shows that module internals only', () => {
    const view = filterForView(selection({
      graphNodes: [graphNode({ id: 'resource.a' }), graphNode({ id: 'resource.inner' })],
      catalog,
      selectedModule: 'module.m',
    }));

    expect(idsOf(view.visibleNodes)).toEqual(['resource.inner']);
  });

  it('shows nothing when the catalog does not know the module', () => {
    const view = filterForView(selection({
      graphNodes: [graphNode({ id: 'resource.a' })],
      catalog,
      selectedModule: 'module.gone',
    }));

    expect(view.visibleNodes).toEqual([]);
    expect(view.visibleEdges).toEqual([]);
  });
});

describe('filterForView — a project is selected', () => {
  const catalog = catalogOf(
    [
      projectInfo({
        name: 'billing',
        resourceIds: ['resource.a', 'resource.b'],
        subprojects: [{ name: 'api', resourceIds: ['resource.a'], resourceCount: 1 }],
      }),
    ],
    [moduleInfo({ name: 'module.m', internalResourceIds: ['resource.inner'] })],
  );

  const graphNodes = [
    graphNode({ id: 'resource.a' }),
    graphNode({ id: 'resource.b' }),
    graphNode({ id: 'resource.outsider' }),
    graphNode({ id: 'resource.inner', isModuleInternal: true, parentModule: 'module.m' }),
  ];

  it('keeps the project resources', () => {
    const view = filterForView(selection({ graphNodes, catalog, selectedProject: 'billing' }));

    expect(idsOf(view.visibleNodes)).toContain('resource.a');
    expect(idsOf(view.visibleNodes)).toContain('resource.b');
  });

  it('pulls in a neighbour outside the project as a ghost', () => {
    const view = filterForView(selection({
      graphNodes,
      graphEdges: [graphEdge('resource.a', 'resource.outsider')],
      catalog,
      selectedProject: 'billing',
    }));

    expect([...view.ghostNodeIds]).toEqual(['resource.outsider']);
    expect(idsOf(view.visibleNodes)).toContain('resource.outsider');
    expect(view.visibleEdges[0].type).toBe('ghost');
  });

  it('marks an inbound cross-project edge as a ghost too', () => {
    const view = filterForView(selection({
      graphNodes,
      graphEdges: [graphEdge('resource.outsider', 'resource.b')],
      catalog,
      selectedProject: 'billing',
    }));

    expect([...view.ghostNodeIds]).toEqual(['resource.outsider']);
    expect(view.visibleEdges[0].type).toBe('ghost');
  });

  it('narrows down to a subproject when one is selected', () => {
    const view = filterForView(selection({
      graphNodes,
      catalog,
      selectedProject: 'billing',
      selectedSubproject: 'api',
    }));

    expect(idsOf(view.visibleNodes)).toEqual(['resource.a']);
  });

  it('shows nothing when the catalog does not know the project', () => {
    const view = filterForView(selection({ graphNodes, catalog, selectedProject: 'gone' }));

    expect(view.visibleNodes).toEqual([]);
  });

  it('adds the internals of an expanded module', () => {
    const view = filterForView(selection({
      graphNodes,
      catalog,
      selectedProject: 'billing',
      expandedModuleId: 'module.m',
    }));

    expect(idsOf(view.visibleNodes)).toContain('resource.inner');
  });

  it('leaves the internals of a collapsed module out', () => {
    const view = filterForView(selection({ graphNodes, catalog, selectedProject: 'billing' }));

    expect(idsOf(view.visibleNodes)).not.toContain('resource.inner');
  });
});
