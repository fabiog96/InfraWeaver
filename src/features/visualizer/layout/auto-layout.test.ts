import type { Node } from '@xyflow/react';
import { describe, expect, it } from 'vitest';

import type { GraphEdge, GraphNode } from '../resolver/types';
import { computeLayout, groupNodesByFile } from './auto-layout';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;
const GROUP_PADDING = 60;
const GRAPH_MARGIN = 40;
const FILE_GROUP_PALETTE = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
];

const graphNode = (overrides: Partial<GraphNode> & Pick<GraphNode, 'id'>): GraphNode => ({
  type: 'resource',
  provider: 'aws',
  serviceType: 'aws_s3_bucket',
  label: overrides.id,
  filePath: 'resources/070-microservices/report-downloader.tf',
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

const byId = (nodes: Node[], id: string): Node => {
  const found = nodes.find((node) => node.id === id);
  if (!found) throw new Error(`no node with id "${id}" in the layout`);
  return found;
};

const iconsOf = (node: Node): string[] => node.data.icons as string[];

describe('computeLayout — saved positions', () => {
  it('places a node where the user left it instead of where dagre wants it', () => {
    const nodes = [graphNode({ id: 'resource.a' }), graphNode({ id: 'resource.b' })];
    const edges = [graphEdge('resource.a', 'resource.b')];

    const dagreOnly = computeLayout(nodes, edges);
    const withSaved = computeLayout(nodes, edges, { 'resource.b': { x: 999, y: -42 } });

    expect(byId(withSaved.nodes, 'resource.b').position).toEqual({ x: 999, y: -42 });
    expect(byId(dagreOnly.nodes, 'resource.b').position).not.toEqual({ x: 999, y: -42 });
  });

  it('leaves the nodes the user never moved on their dagre position', () => {
    const nodes = [graphNode({ id: 'resource.a' }), graphNode({ id: 'resource.b' })];
    const edges = [graphEdge('resource.a', 'resource.b')];

    const dagreOnly = computeLayout(nodes, edges);
    const withSaved = computeLayout(nodes, edges, { 'resource.b': { x: 999, y: -42 } });

    expect(byId(withSaved.nodes, 'resource.a').position).toEqual(
      byId(dagreOnly.nodes, 'resource.a').position,
    );
  });

  it('places a module where the user left it, the same as a resource', () => {
    const module = graphNode({
      id: 'module.campaign_proximity_service',
      type: 'module',
      moduleSource: 'api-gateway-lambda',
    });

    const dagreOnly = computeLayout([module], []);
    const withSaved = computeLayout([module], [], {
      'module.campaign_proximity_service': { x: 100, y: 200 },
    });

    expect(byId(withSaved.nodes, 'module.campaign_proximity_service').position).toEqual({
      x: 100,
      y: 200,
    });
    expect(byId(dagreOnly.nodes, 'module.campaign_proximity_service').position).not.toEqual({
      x: 100,
      y: 200,
    });
  });

  it('ignores a saved position that belongs to a node no longer in the graph', () => {
    const { nodes } = computeLayout([graphNode({ id: 'resource.a' })], [], {
      'resource.vanished': { x: 12, y: 34 },
    });

    expect(nodes.map((node) => node.id)).toEqual(['resource.a']);
    expect(byId(nodes, 'resource.a').position).toEqual({ x: GRAPH_MARGIN, y: GRAPH_MARGIN });
  });
});

describe('computeLayout — dagre placement', () => {
  it('stacks a dependent below the node it depends on', () => {
    const { nodes } = computeLayout(
      [graphNode({ id: 'resource.upstream' }), graphNode({ id: 'resource.downstream' })],
      [graphEdge('resource.upstream', 'resource.downstream')],
    );

    expect(byId(nodes, 'resource.upstream').position.y).toBeLessThan(
      byId(nodes, 'resource.downstream').position.y,
    );
  });

  it('reports the top-left corner of the node, not the centre dagre computes', () => {
    const { nodes } = computeLayout([graphNode({ id: 'resource.only' })], []);

    expect(byId(nodes, 'resource.only').position).toEqual({ x: GRAPH_MARGIN, y: GRAPH_MARGIN });
  });

  it('keeps an edge that points outside the graph without inventing a node for it', () => {
    const { nodes, edges } = computeLayout(
      [graphNode({ id: 'resource.a' })],
      [graphEdge('resource.a', 'resource.missing')],
    );

    expect(nodes.map((node) => node.id)).toEqual(['resource.a']);
    expect(edges.map((edge) => edge.id)).toEqual(['resource.a->resource.missing']);
  });

  it('lays the graph out as if an edge pointing outside it were not there', () => {
    const present = [
      graphNode({ id: 'resource.a' }),
      graphNode({ id: 'resource.b' }),
      graphNode({ id: 'resource.c' }),
    ];
    const realEdge = graphEdge('resource.a', 'resource.b');

    const withDangling = computeLayout(present, [
      realEdge,
      graphEdge('resource.a', 'resource.gone'),
      graphEdge('resource.gone', 'resource.a'),
    ]);
    const withoutDangling = computeLayout(present, [realEdge]);

    expect(withDangling.nodes.map((node) => node.position)).toEqual(
      withoutDangling.nodes.map((node) => node.position),
    );
  });
});

describe('computeLayout — element shape', () => {
  it('turns every graph edge into a vizEdge carrying its label and kind', () => {
    const { edges } = computeLayout(
      [graphNode({ id: 'resource.a' }), graphNode({ id: 'resource.b' })],
      [{ ...graphEdge('resource.a', 'resource.b'), type: 'ghost', label: 'cross-project' }],
    );

    expect(edges).toEqual([
      {
        id: 'resource.a->resource.b',
        source: 'resource.a',
        target: 'resource.b',
        type: 'vizEdge',
        data: { label: 'cross-project', edgeType: 'ghost' },
      },
    ]);
  });

  it('carries the source location of each node into its flow data', () => {
    const { nodes } = computeLayout(
      [graphNode({ id: 'resource.a', filePath: 'resources/010-network/vpc.tf', lineStart: 17 })],
      [],
    );

    expect(byId(nodes, 'resource.a').data).toMatchObject({
      filePath: 'resources/010-network/vpc.tf',
      lineStart: 17,
    });
  });

  it('describes a resource by its own type, not as a module', () => {
    const { nodes } = computeLayout(
      [graphNode({ id: 'resource.aws_s3_bucket.reports', serviceType: 'aws_s3_bucket' })],
      [],
    );

    expect(byId(nodes, 'resource.aws_s3_bucket.reports').data).toMatchObject({
      nodeType: 'resource',
      serviceType: 'aws_s3_bucket',
      isComposite: false,
    });
  });

  it('carries the source location of a module into its flow data too', () => {
    const { nodes } = computeLayout(
      [
        graphNode({
          id: 'module.m',
          type: 'module',
          moduleSource: 'api-gateway-lambda',
          filePath: 'resources/070-microservices/report-downloader.tf',
          lineStart: 42,
        }),
      ],
      [],
    );

    expect(byId(nodes, 'module.m').data).toMatchObject({
      filePath: 'resources/070-microservices/report-downloader.tf',
      lineStart: 42,
    });
  });

  const moduleNode = (moduleSource: string): Node => {
    const { nodes } = computeLayout(
      [graphNode({ id: 'module.under_test', type: 'module', moduleSource })],
      [],
    );
    return byId(nodes, 'module.under_test');
  };

  it('styles a module from the icons its source maps to', () => {
    const node = moduleNode('api-gateway-lambda');

    expect(node.data.nodeType).toBe('module');
    expect(node.data.serviceType).toBe('API GW + Lambda');
    expect(iconsOf(node)).toEqual(['aws-api-gateway', 'aws-lambda']);
  });

  it('flags a module composite only when it draws more than one icon', () => {
    expect(moduleNode('api-gateway-lambda').data.isComposite).toBe(true);
    expect(moduleNode('scheduled-lambda').data.isComposite).toBe(false);
  });

  it('falls back to a database icon for a data source the mapping does not know', () => {
    const { nodes } = computeLayout(
      [graphNode({ id: 'data.aws_mystery.thing', type: 'data', serviceType: 'aws_mystery' })],
      [],
    );

    expect(iconsOf(byId(nodes, 'data.aws_mystery.thing'))).toEqual(['generic-database']);
  });
});

describe('groupNodesByFile', () => {
  const sameFile = 'resources/070-microservices/report-downloader.tf';
  const groupId = `group:${sameFile}`;

  const laidOut = (positions: Record<string, { x: number; y: number }>): Node[] =>
    computeLayout(
      Object.keys(positions).map((id) => graphNode({ id, filePath: sameFile })),
      [],
      positions,
    ).nodes;

  const grouped = (nodes: Node[], ghostIds: string[] = []): Node[] =>
    groupNodesByFile(nodes, new Set(ghostIds));

  const groupOf = (nodes: Node[], ghostIds: string[] = []): Node =>
    byId(grouped(nodes, ghostIds), groupId);

  it('wraps the nodes of a file in a group sized to their bounding box', () => {
    const nodes = laidOut({ 'resource.a': { x: 0, y: 0 }, 'resource.b': { x: 300, y: 100 } });

    const group = groupOf(nodes);

    expect(group.position).toEqual({ x: -GROUP_PADDING, y: -GROUP_PADDING });
    expect(group.style).toEqual({
      width: 300 + NODE_WIDTH + GROUP_PADDING * 2,
      height: 100 + NODE_HEIGHT + GROUP_PADDING * 2,
    });
  });

  it('offsets the group by the minimum child position, not by the canvas origin', () => {
    const nodes = laidOut({ 'resource.a': { x: 120, y: 80 }, 'resource.b': { x: 420, y: 180 } });

    const group = groupOf(nodes);

    expect(group.position).toEqual({ x: 120 - GROUP_PADDING, y: 80 - GROUP_PADDING });
    expect(group.style).toEqual({
      width: 300 + NODE_WIDTH + GROUP_PADDING * 2,
      height: 100 + NODE_HEIGHT + GROUP_PADDING * 2,
    });
  });

  it('subtracts the group origin from each child, not a bare padding', () => {
    const nodes = laidOut({ 'resource.a': { x: 120, y: 80 }, 'resource.b': { x: 420, y: 180 } });

    const withGroups = grouped(nodes);

    expect(byId(withGroups, 'resource.a').position).toEqual({ x: 60, y: 60 });
    expect(byId(withGroups, 'resource.b').position).toEqual({ x: 360, y: 160 });
  });

  it('labels the group with the file name without its extension', () => {
    const nodes = laidOut({ 'resource.a': { x: 0, y: 0 }, 'resource.b': { x: 300, y: 100 } });

    expect(groupOf(nodes).data.label).toBe('report-downloader');
  });

  it('colors the group from the palette rather than falling back to grey', () => {
    const nodes = laidOut({ 'resource.a': { x: 0, y: 0 }, 'resource.b': { x: 300, y: 100 } });

    expect(FILE_GROUP_PALETTE).toContain(groupOf(nodes).data.color);
  });

  it('derives the group color from the file path, not from the first child', () => {
    const { nodes } = computeLayout(
      [
        graphNode({ id: 'resource.a', filePath: 'a.tf' }),
        graphNode({ id: 'resource.b', filePath: 'a.tf' }),
        graphNode({ id: 'resource.c', filePath: 'b.tf' }),
        graphNode({ id: 'resource.d', filePath: 'b.tf' }),
      ],
      [],
    );
    const withGroups = grouped(nodes);
    const colorOf = (id: string): unknown => byId(withGroups, id).data.color;

    expect(colorOf('group:a.tf')).not.toBe(colorOf('group:b.tf'));
  });

  it('re-expresses each child position relative to the group origin', () => {
    const nodes = laidOut({ 'resource.a': { x: 0, y: 0 }, 'resource.b': { x: 300, y: 100 } });

    const withGroups = grouped(nodes);

    expect(byId(withGroups, 'resource.a').position).toEqual({ x: GROUP_PADDING, y: GROUP_PADDING });
    expect(byId(withGroups, 'resource.b').position).toEqual({
      x: 300 + GROUP_PADDING,
      y: 100 + GROUP_PADDING,
    });
  });

  it('adopts each child into the group and pins it inside', () => {
    const nodes = laidOut({ 'resource.a': { x: 0, y: 0 }, 'resource.b': { x: 300, y: 100 } });

    const withGroups = grouped(nodes);

    for (const child of ['resource.a', 'resource.b']) {
      expect(byId(withGroups, child)).toMatchObject({ parentId: groupId, extent: 'parent' });
    }
  });

  it('lists the group before its children, as React Flow requires', () => {
    const nodes = laidOut({ 'resource.a': { x: 0, y: 0 }, 'resource.b': { x: 300, y: 100 } });

    const ids = grouped(nodes).map((node) => node.id);

    expect(ids.indexOf(groupId)).toBeLessThan(ids.indexOf('resource.a'));
  });

  it('leaves a ghost node out of the group it would otherwise join', () => {
    const nodes = laidOut({
      'resource.a': { x: 0, y: 0 },
      'resource.b': { x: 300, y: 100 },
      'resource.ghost': { x: 900, y: 900 },
    });

    const ghost = byId(grouped(nodes, ['resource.ghost']), 'resource.ghost');

    expect(ghost.parentId).toBeUndefined();
    expect(ghost.position).toEqual({ x: 900, y: 900 });
  });

  it('keeps a ghost node out of the bounding box it would otherwise stretch', () => {
    const nodes = laidOut({
      'resource.a': { x: 0, y: 0 },
      'resource.b': { x: 300, y: 100 },
      'resource.ghost': { x: 900, y: 900 },
    });

    expect(groupOf(nodes, ['resource.ghost']).style).toEqual({
      width: 300 + NODE_WIDTH + GROUP_PADDING * 2,
      height: 100 + NODE_HEIGHT + GROUP_PADDING * 2,
    });
  });

  it('does not group a file that holds a single node', () => {
    const nodes = laidOut({ 'resource.alone': { x: 0, y: 0 } });

    expect(grouped(nodes)).toEqual(nodes);
  });

  it('does not group a file left with a single node once its ghosts are excluded', () => {
    const nodes = laidOut({ 'resource.a': { x: 0, y: 0 }, 'resource.ghost': { x: 300, y: 100 } });

    expect(grouped(nodes, ['resource.ghost'])).toEqual(nodes);
  });

  it('gives each file its own group', () => {
    const { nodes } = computeLayout(
      [
        graphNode({ id: 'resource.a', filePath: 'a.tf' }),
        graphNode({ id: 'resource.b', filePath: 'a.tf' }),
        graphNode({ id: 'resource.c', filePath: 'b.tf' }),
        graphNode({ id: 'resource.d', filePath: 'b.tf' }),
      ],
      [],
    );

    const withGroups = grouped(nodes);
    const groups = withGroups.filter((node) => node.type === 'vizGroup').map((node) => node.id);

    expect(new Set(groups)).toEqual(new Set(['group:a.tf', 'group:b.tf']));
  });

  it('adopts each node into the group of its own file', () => {
    const { nodes } = computeLayout(
      [
        graphNode({ id: 'resource.a', filePath: 'a.tf' }),
        graphNode({ id: 'resource.b', filePath: 'a.tf' }),
        graphNode({ id: 'resource.c', filePath: 'b.tf' }),
        graphNode({ id: 'resource.d', filePath: 'b.tf' }),
      ],
      [],
    );

    const withGroups = grouped(nodes);

    expect(byId(withGroups, 'resource.a').parentId).toBe('group:a.tf');
    expect(byId(withGroups, 'resource.b').parentId).toBe('group:a.tf');
    expect(byId(withGroups, 'resource.c').parentId).toBe('group:b.tf');
    expect(byId(withGroups, 'resource.d').parentId).toBe('group:b.tf');
  });
});
