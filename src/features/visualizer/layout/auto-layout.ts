import dagre from '@dagrejs/dagre';
import type { Node, Edge } from '@xyflow/react';

import type { GraphNode, GraphEdge } from '../resolver/types';
import { getResourceStyle, getModuleStyle } from './service-mapping';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;
const GROUP_PADDING = 60;

/**
 * Computes a dagre auto-layout for the dependency graph and converts
 * GraphNode/GraphEdge into React Flow Node/Edge elements.
 *
 * Dagre positions nodes in a top-down hierarchical layout based on their
 * dependency edges. Nodes that depend on others are placed below them.
 * Saved positions (from D7) override dagre-calculated positions for
 * nodes that the user has manually repositioned.
 *
 * @example
 * const { nodes, edges } = computeLayout(graphNodes, graphEdges, savedPositions);
 * // nodes → React Flow Node[] with { position: { x, y }, data: { label, icon, ... } }
 * // edges → React Flow Edge[] with { source, target, label, style }
 */
export const computeLayout = (
  graphNodes: GraphNode[],
  graphEdges: GraphEdge[],
  savedPositions?: Record<string, { x: number; y: number }>,
): { nodes: Node[]; edges: Edge[] } => {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: 'TB',
    nodesep: 50,
    ranksep: 80,
    marginx: 40,
    marginy: 40,
  });

  for (const node of graphNodes) {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }

  for (const edge of graphEdges) {
    if (g.hasNode(edge.source) && g.hasNode(edge.target)) {
      g.setEdge(edge.source, edge.target);
    }
  }

  dagre.layout(g);

  const flowNodes: Node[] = graphNodes.map((gNode) => {
    const dagreNode = g.node(gNode.id);
    const saved = savedPositions?.[gNode.id];

    const position = saved ?? {
      x: (dagreNode?.x ?? 0) - NODE_WIDTH / 2,
      y: (dagreNode?.y ?? 0) - NODE_HEIGHT / 2,
    };

    if (gNode.type === 'module' && gNode.moduleSource) {
      const style = getModuleStyle(gNode.moduleSource);
      return {
        id: gNode.id,
        type: 'vizNode',
        position,
        data: {
          label: gNode.label,
          serviceType: style.label,
          icons: style.icons,
          color: style.color,
          provider: gNode.provider,
          nodeType: gNode.type,
          layer: gNode.layer,
          project: gNode.project,
          filePath: gNode.filePath,
          lineStart: gNode.lineStart,
          moduleSource: gNode.moduleSource,
          isComposite: style.icons.length > 1,
        },
      };
    }

    const style = getResourceStyle(gNode.serviceType.replace(/ /g, '_'));
    const icon = style.icon !== 'generic-server' ? style.icon : inferIconFromType(gNode);

    return {
      id: gNode.id,
      type: 'vizNode',
      position,
      data: {
        label: gNode.label,
        serviceType: gNode.serviceType,
        icons: [icon],
        color: style.color !== '#666666' ? style.color : '#666666',
        provider: gNode.provider,
        nodeType: gNode.type,
        layer: gNode.layer,
        project: gNode.project,
        filePath: gNode.filePath,
        lineStart: gNode.lineStart,
        isComposite: false,
      },
    };
  });

  const flowEdges: Edge[] = graphEdges.map((gEdge) => ({
    id: gEdge.id,
    source: gEdge.source,
    target: gEdge.target,
    type: 'vizEdge',
    data: {
      label: gEdge.label,
      edgeType: gEdge.type,
    },
  }));

  return { nodes: flowNodes, edges: flowEdges };
};

/**
 * Attempts to infer an icon key from a GraphNode's raw resource type
 * when the service mapping doesn't have an explicit match.
 * Reconstructs the full resource type string and checks the mapping.
 */
const inferIconFromType = (node: GraphNode): string => {
  if (node.type === 'data') {
    const resourceMapping: Record<string, string> = {
      aws_ecr_repository: 'aws-ecs',
      aws_acm_certificate: 'aws-cloudfront',
      aws_route53_zone: 'aws-route53',
      aws_caller_identity: 'aws-iam',
      aws_region: 'generic-server',
      aws_s3_bucket: 'aws-s3',
      aws_secretsmanager_secret: 'aws-iam',
      aws_secretsmanager_secret_version: 'aws-iam',
      google_project: 'gcp-compute',
    };
    const raw = node.serviceType.replace(/ /g, '_');
    return resourceMapping[raw] ?? 'generic-database';
  }
  return 'generic-server';
};

/**
 * Computes layout for group nodes that wrap individual nodes by project or layer.
 * Creates parent group nodes sized to contain their children with padding.
 *
 * @example
 * const { groupNodes, childUpdates } = computeGroupLayout(flowNodes, 'project');
 * // groupNodes → [{ id: 'group:campaign-proximity', type: 'vizGroup', ... }]
 * // childUpdates → Map of nodeId → { parentId, position offset within group }
 */
export const computeGroupLayout = (
  flowNodes: Node[],
  groupBy: 'project' | 'layer',
): { groupNodes: Node[]; childUpdates: Map<string, { parentId: string; position: { x: number; y: number } }> } => {
  const groups = new Map<string, Node[]>();

  for (const node of flowNodes) {
    const key = groupBy === 'project'
      ? (node.data?.project as string | undefined)
      : (node.data?.layer as string | undefined);
    if (!key) continue;
    const existing = groups.get(key) ?? [];
    existing.push(node);
    groups.set(key, existing);
  }

  const groupNodes: Node[] = [];
  const childUpdates = new Map<string, { parentId: string; position: { x: number; y: number } }>();

  for (const [key, children] of groups.entries()) {
    if (children.length < 2) continue;

    const minX = Math.min(...children.map((n) => n.position.x));
    const minY = Math.min(...children.map((n) => n.position.y));
    const maxX = Math.max(...children.map((n) => n.position.x + NODE_WIDTH));
    const maxY = Math.max(...children.map((n) => n.position.y + NODE_HEIGHT));

    const groupId = `group:${key}`;
    const groupX = minX - GROUP_PADDING;
    const groupY = minY - GROUP_PADDING;

    groupNodes.push({
      id: groupId,
      type: 'vizGroup',
      position: { x: groupX, y: groupY },
      style: {
        width: maxX - minX + GROUP_PADDING * 2,
        height: maxY - minY + GROUP_PADDING * 2,
      },
      data: {
        label: key,
        color: children[0]?.data?.color ?? '#666666',
      },
    });

    for (const child of children) {
      childUpdates.set(child.id, {
        parentId: groupId,
        position: {
          x: child.position.x - groupX,
          y: child.position.y - groupY,
        },
      });
    }
  }

  return { groupNodes, childUpdates };
};
