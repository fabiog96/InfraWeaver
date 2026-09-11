import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ProjectCatalog } from '../discovery/types';
import type { ParseError } from '../parser/types';
import type { GraphNode } from '../resolver/types';
import { useVisualizerStore } from '../stores/visualizerStore';
import { syncFlowElements, type FlowSyncInput } from './flow-sync';

const { computeLayoutMock } = vi.hoisted(() => ({ computeLayoutMock: vi.fn() }));

vi.mock('./auto-layout', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./auto-layout')>();
  return { ...actual, computeLayout: computeLayoutMock };
});

const emptyCatalog: ProjectCatalog = {
  projects: new Map(),
  modules: new Map(),
  untaggedResourceIds: [],
  totalTagged: 0,
  totalUntagged: 0,
};

const parseError: ParseError = {
  level: 'parse_error',
  filePath: 'broken.tf',
  message: 'The HCL parser rejected this file without reporting a reason.',
};

const graphNode = (id: string): GraphNode => ({
  id,
  type: 'resource',
  provider: 'aws',
  serviceType: 'aws_s3_bucket',
  label: id,
  filePath: 'resources/storage.tf',
  lineStart: 1,
});

const input = (): FlowSyncInput => ({
  graphNodes: [graphNode('resource.a'), graphNode('resource.b')],
  graphEdges: [],
  catalog: emptyCatalog,
  selectedProject: null,
  selectedSubproject: null,
  selectedModule: null,
  expandedModuleId: null,
  positionKey: 'owner/repo/main/all',
  branch: 'main',
});

const publish = () => {
  const { setFlowElements, setLayoutError } = useVisualizerStore.getState();
  return { setFlowElements, setLayoutError };
};

const errorsInStore = (): ParseError[] => useVisualizerStore.getState().errors;

const failTheLayout = (reason: string): void => {
  computeLayoutMock.mockImplementation(() => {
    throw new Error(reason);
  });
};

beforeEach(async () => {
  const actual = await vi.importActual<typeof import('./auto-layout')>('./auto-layout');
  computeLayoutMock.mockImplementation(actual.computeLayout);
  useVisualizerStore.setState({ errors: [], flowNodes: [], flowEdges: [] });
});

describe('syncFlowElements', () => {
  it('publishes the laid out elements when the layout succeeds', () => {
    expect(syncFlowElements(input(), publish())).toBe(true);
    expect(useVisualizerStore.getState().flowNodes.length).toBeGreaterThan(0);
    expect(errorsInStore()).toEqual([]);
  });

  it('reports a failing layout as an error instead of throwing', () => {
    failTheLayout('dagre ran out of ranks');

    expect(syncFlowElements(input(), publish())).toBe(false);
    expect(errorsInStore()).toHaveLength(1);
    expect(errorsInStore()[0].level).toBe('layout_error');
    expect(errorsInStore()[0].message).toContain('dagre ran out of ranks');
  });

  it('leaves the canvas untouched when the layout fails', () => {
    syncFlowElements(input(), publish());
    const laidOut = useVisualizerStore.getState().flowNodes;

    failTheLayout('dagre ran out of ranks');
    syncFlowElements(input(), publish());

    expect(useVisualizerStore.getState().flowNodes).toBe(laidOut);
  });

  it('keeps the parse errors already on the panel', () => {
    useVisualizerStore.setState({ errors: [parseError] });
    failTheLayout('dagre ran out of ranks');

    syncFlowElements(input(), publish());

    expect(errorsInStore()).toHaveLength(2);
    expect(errorsInStore()[0]).toEqual(parseError);
  });

  it('does not stack one layout error per retry', () => {
    failTheLayout('dagre ran out of ranks');

    syncFlowElements(input(), publish());
    syncFlowElements(input(), publish());

    expect(errorsInStore().filter((e) => e.level === 'layout_error')).toHaveLength(1);
  });

  it('clears the layout error once a later layout succeeds', async () => {
    useVisualizerStore.setState({ errors: [parseError] });
    failTheLayout('dagre ran out of ranks');
    syncFlowElements(input(), publish());

    const actual = await vi.importActual<typeof import('./auto-layout')>('./auto-layout');
    computeLayoutMock.mockImplementation(actual.computeLayout);
    syncFlowElements(input(), publish());

    expect(errorsInStore()).toEqual([parseError]);
  });

  it('leaves the parse errors alone when the layout succeeds', () => {
    useVisualizerStore.setState({ errors: [parseError] });

    syncFlowElements(input(), publish());

    expect(errorsInStore()).toEqual([parseError]);
  });
});
