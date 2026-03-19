import type { Node } from '@xyflow/react';

import type { TechNodeData, GroupNodeData } from '@/shared/types';
import { getModule } from '../data/module-registry';

export interface FolderNode {
  name: string;
  path: string;
  type: 'folder' | 'file';
  children?: FolderNode[];
  nodeId?: string;
}

const sanitizeFolderName = (label: string): string => {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'unnamed';
};

const deduplicateFolderName = (name: string, existing: Set<string>): string => {
  if (!existing.has(name)) {
    existing.add(name);
    return name;
  }
  let counter = 2;
  while (existing.has(`${name}-${counter}`)) counter++;
  const unique = `${name}-${counter}`;
  existing.add(unique);
  return unique;
};

export const generateFolderStructure = (
  nodes: Node[],
): FolderNode => {
  const root: FolderNode = {
    name: 'infrastructure-live',
    path: 'infrastructure-live',
    type: 'folder',
    children: [],
  };

  root.children!.push({
    name: 'terragrunt.hcl',
    path: 'infrastructure-live/terragrunt.hcl',
    type: 'file',
  });

  root.children!.push({
    name: '_env',
    path: 'infrastructure-live/_env',
    type: 'folder',
    children: [
      {
        name: 'common.hcl',
        path: 'infrastructure-live/_env/common.hcl',
        type: 'file',
      },
    ],
  });

  const groupNodes = nodes.filter((n) => n.type === 'group');
  const techNodes = nodes.filter((n) => n.type === 'tech');

  const groupedByParent = new Map<string, Node[]>();
  const ungroupedNodes: Node[] = [];

  for (const tech of techNodes) {
    const data = tech.data as TechNodeData;
    if (!data.moduleId) continue;

    const module = getModule(data.moduleId);
    if (!module) continue;

    if (tech.parentId) {
      const existing = groupedByParent.get(tech.parentId) || [];
      existing.push(tech);
      groupedByParent.set(tech.parentId, existing);
    } else {
      ungroupedNodes.push(tech);
    }
  }

  for (const group of groupNodes) {
    const groupData = group.data as GroupNodeData;
    const folderName = groupData.folderName || sanitizeFolderName(groupData.label);
    const groupPath = `infrastructure-live/${folderName}`;
    const groupFolder: FolderNode = {
      name: folderName,
      path: groupPath,
      type: 'folder',
      children: [],
    };

    const children = groupedByParent.get(group.id) || [];
    const usedNames = new Set<string>();
    for (const child of children) {
      const childData = child.data as TechNodeData;
      const childFolder = deduplicateFolderName(sanitizeFolderName(childData.label), usedNames);
      const childPath = `${groupPath}/${childFolder}`;
      groupFolder.children!.push(buildModuleFolder(childFolder, childPath, child.id));
    }

    root.children!.push(groupFolder);
  }

  const categoryNameSets = new Map<string, Set<string>>();
  for (const node of ungroupedNodes) {
    const data = node.data as TechNodeData;
    const module = getModule(data.moduleId);
    if (!module) continue;

    const category = module.category;

    let categoryFolder = root.children!.find(
      (c) => c.type === 'folder' && c.name === category,
    );
    if (!categoryFolder) {
      categoryFolder = {
        name: category,
        path: `infrastructure-live/${category}`,
        type: 'folder',
        children: [],
      };
      root.children!.push(categoryFolder);
      categoryNameSets.set(category, new Set<string>());
    }

    const usedNames = categoryNameSets.get(category) || new Set<string>();
    categoryNameSets.set(category, usedNames);
    const nodeFolder = deduplicateFolderName(sanitizeFolderName(data.label), usedNames);
    const nodePath = `infrastructure-live/${category}/${nodeFolder}`;

    categoryFolder.children!.push(buildModuleFolder(nodeFolder, nodePath, node.id));
  }

  return root;
};

const buildModuleFolder = (name: string, path: string, nodeId: string): FolderNode => ({
  name,
  path,
  type: 'folder',
  nodeId,
  children: [
    { name: 'main.tf', path: `${path}/main.tf`, type: 'file', nodeId },
    { name: 'variables.tf', path: `${path}/variables.tf`, type: 'file', nodeId },
    { name: 'outputs.tf', path: `${path}/outputs.tf`, type: 'file', nodeId },
    { name: 'terragrunt.hcl', path: `${path}/terragrunt.hcl`, type: 'file', nodeId },
  ],
});

export const flattenFiles = (node: FolderNode): { path: string; nodeId?: string }[] => {
  const result: { path: string; nodeId?: string }[] = [];

  if (node.type === 'file') {
    result.push({ path: node.path, nodeId: node.nodeId });
    return result;
  }

  if (node.children) {
    for (const child of node.children) {
      result.push(...flattenFiles(child));
    }
  }

  return result;
};
