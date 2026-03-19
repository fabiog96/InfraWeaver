import type { Node, Edge } from '@xyflow/react';

import type { TechNodeData, OutputMapping } from '@/shared/types';
import { type FolderNode, flattenFiles } from './folder-structure-generator';

export interface DependencyBlock {
  name: string;
  configPath: string;
  outputMappings: OutputMapping[];
}

export interface DependencyGraph {
  adjacency: Map<string, string[]>;
  dependencyBlocks: Map<string, DependencyBlock[]>;
}

export interface CycleError {
  cycle: string[];
  message: string;
}

const getNodePath = (nodeId: string, folderTree: FolderNode): string | null => {
  const allFiles = flattenFiles(folderTree);
  const entry = allFiles.find((f) => f.nodeId === nodeId && f.path.endsWith('main.tf'));
  if (!entry) return null;
  return entry.path.replace(/\/main\.tf$/, '');
};

const computeRelativePath = (fromPath: string, toPath: string): string => {
  const fromParts = fromPath.split('/');
  const toParts = toPath.split('/');

  let common = 0;
  while (
    common < fromParts.length &&
    common < toParts.length &&
    fromParts[common] === toParts[common]
  ) {
    common++;
  }

  const upCount = fromParts.length - common;
  const downParts = toParts.slice(common);

  return [...Array(upCount).fill('..'), ...downParts].join('/');
};

export const buildDependencyGraph = (
  nodes: Node[],
  edges: Edge[],
  folderTree: FolderNode,
): DependencyGraph => {
  const adjacency = new Map<string, string[]>();
  const dependencyBlocks = new Map<string, DependencyBlock[]>();

  const techNodes = nodes.filter((n) => n.type === 'tech');
  for (const node of techNodes) {
    adjacency.set(node.id, []);
    dependencyBlocks.set(node.id, []);
  }

  for (const edge of edges) {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);
    if (!sourceNode || !targetNode) continue;

    const sourceData = sourceNode.data as TechNodeData;
    const targetData = targetNode.data as TechNodeData;
    if (!sourceData.moduleId || !targetData.moduleId) continue;

    const existing = adjacency.get(edge.target) || [];
    existing.push(edge.source);
    adjacency.set(edge.target, existing);

    const sourcePath = getNodePath(edge.source, folderTree);
    const targetPath = getNodePath(edge.target, folderTree);
    if (!sourcePath || !targetPath) continue;

    const depName = sourceData.label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '') || sourceData.moduleId;

    const edgeData = edge.data as { outputMapping?: OutputMapping[] } | undefined;
    const mappings = edgeData?.outputMapping || [];

    const blocks = dependencyBlocks.get(edge.target) || [];
    blocks.push({
      name: depName,
      configPath: computeRelativePath(targetPath, sourcePath),
      outputMappings: mappings,
    });
    dependencyBlocks.set(edge.target, blocks);
  }

  return { adjacency, dependencyBlocks };
};

export const detectCycles = (graph: DependencyGraph): CycleError[] => {
  const errors: CycleError[] = [];
  const visited = new Set<string>();
  const inStack = new Set<string>();
  const path: string[] = [];

  const dfs = (nodeId: string): boolean => {
    if (inStack.has(nodeId)) {
      const cycleStart = path.indexOf(nodeId);
      const cycle = path.slice(cycleStart).concat(nodeId);
      errors.push({
        cycle,
        message: `Circular dependency detected: ${cycle.join(' -> ')}`,
      });
      return true;
    }

    if (visited.has(nodeId)) return false;

    visited.add(nodeId);
    inStack.add(nodeId);
    path.push(nodeId);

    const deps = graph.adjacency.get(nodeId) || [];
    for (const dep of deps) {
      dfs(dep);
    }

    path.pop();
    inStack.delete(nodeId);
    return false;
  };

  for (const nodeId of graph.adjacency.keys()) {
    if (!visited.has(nodeId)) {
      dfs(nodeId);
    }
  }

  return errors;
};

export const getDependencyBlocks = (
  nodeId: string,
  graph: DependencyGraph,
): DependencyBlock[] => {
  return graph.dependencyBlocks.get(nodeId) || [];
};
