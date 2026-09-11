import dagre from '@dagrejs/dagre';
import type { Node, Edge } from '@xyflow/react';

import type { GraphNode, GraphEdge } from '../resolver/types';
import { getResourceStyle, getModuleStyle } from './service-mapping';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;
const GROUP_PADDING = 60;
const MIN_NODES_PER_GROUP = 2;

const FILE_GROUP_PALETTE = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
];

const pickColorFromFilePath = (filePath: string): string => {
  let hash = 0;
  for (let i = 0; i < filePath.length; i++) {
    hash = ((hash << 5) - hash + filePath.charCodeAt(i)) | 0;
  }
  return FILE_GROUP_PALETTE[Math.abs(hash) % FILE_GROUP_PALETTE.length];
};

const extractFileNameWithoutExtension = (filePath: string): string =>
  filePath.split('/').pop()?.replace(/\.tf$/, '') ?? filePath;

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
    nodesep: 80,
    ranksep: 120,
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
          subproject: gNode.subproject,
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
        subproject: gNode.subproject,
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
      aws_ecr_repository: 'aws-ecr',
      aws_acm_certificate: 'aws-acm',
      aws_route53_zone: 'aws-route53',
      aws_caller_identity: 'aws-iam',
      aws_region: 'generic-server',
      aws_s3_bucket: 'aws-s3',
      aws_secretsmanager_secret: 'aws-secrets-manager',
      aws_secretsmanager_secret_version: 'aws-secrets-manager',
    };
    const raw = node.serviceType.replace(/ /g, '_');
    return resourceMapping[raw] ?? 'generic-database';
  }
  return 'generic-server';
};

/** React Flow requires group parents to precede their children in the node array. */
export const groupNodesByFile = (
  flowNodes: Node[],
  ghostNodeIds: Set<string>,
): Node[] => {
  const nodesByFile = new Map<string, Node[]>();

  for (const node of flowNodes) {
    if (ghostNodeIds.has(node.id)) continue;

    const filePath = node.data?.filePath as string | undefined;
    if (!filePath) continue;

    const bucket = nodesByFile.get(filePath) ?? [];
    bucket.push(node);
    nodesByFile.set(filePath, bucket);
  }

  const groupNodes: Node[] = [];
  const childUpdates = new Map<string, { parentId: string; position: { x: number; y: number } }>();

  for (const [filePath, children] of nodesByFile.entries()) {
    if (children.length < MIN_NODES_PER_GROUP) continue;

    const minX = Math.min(...children.map((n) => n.position.x));
    const minY = Math.min(...children.map((n) => n.position.y));
    const maxX = Math.max(...children.map((n) => n.position.x + NODE_WIDTH));
    const maxY = Math.max(...children.map((n) => n.position.y + NODE_HEIGHT));

    const groupId = `group:${filePath}`;
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
        label: extractFileNameWithoutExtension(filePath),
        color: pickColorFromFilePath(filePath),
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

  if (groupNodes.length === 0) return flowNodes;

  const nodesWithParent = flowNodes.map((node) => {
    const update = childUpdates.get(node.id);
    if (!update) return node;
    return {
      ...node,
      parentId: update.parentId,
      position: update.position,
      extent: 'parent' as const,
    };
  });

  return [...groupNodes, ...nodesWithParent];
};
