import { useMemo, useEffect } from 'react';

import { useShallow } from 'zustand/shallow';

import { useDiagramStore } from '@/stores';
import type { TechNodeData } from '@/shared/types';
import { getModule } from '../data/module-registry';
import { renderMainTf } from '../generators/hcl-renderer';
import { renderVariablesTf } from '../generators/variables-renderer';
import { renderOutputsTf } from '../generators/outputs-renderer';
import { renderTerragruntHcl } from '../generators/terragrunt-renderer';
import { renderRootTerragruntHcl, renderCommonHcl } from '../generators/root-renderer';
import { generateFolderStructure, flattenFiles, type FolderNode } from '../generators/folder-structure-generator';
import { buildDependencyGraph, getDependencyBlocks } from '../generators/dependency-resolver';
import { validateDiagram, type ValidationMessage } from '../validators/diagram-validator';
import { useGlobalConfig } from '../stores/globalConfigStore';
import { useValidationStore } from '../stores/validationStore';

export interface GeneratedFile {
  path: string;
  content: string;
  type: 'tf' | 'hcl';
}

export interface GeneratedProject {
  files: GeneratedFile[];
  folderTree: FolderNode;
  validationMessages: ValidationMessage[];
}

export const useCodeGeneration = (): GeneratedProject => {
  const nodes = useDiagramStore(useShallow((s) => s.nodes));
  const edges = useDiagramStore(useShallow((s) => s.edges));

  const globalConfig = useGlobalConfig();

  const result = useMemo(() => {
    const folderTree = generateFolderStructure(nodes);
    const files: GeneratedFile[] = [];

    const depGraph = buildDependencyGraph(nodes, edges, folderTree);
    const validationMessages = validateDiagram(nodes, edges, depGraph);

    files.push({
      path: 'infrastructure-live/terragrunt.hcl',
      content: renderRootTerragruntHcl(globalConfig),
      type: 'hcl',
    });

    files.push({
      path: 'infrastructure-live/_env/common.hcl',
      content: renderCommonHcl(),
      type: 'hcl',
    });

    const allFileEntries = flattenFiles(folderTree);

    for (const entry of allFileEntries) {
      if (!entry.nodeId) continue;

      const node = nodes.find((n) => n.id === entry.nodeId);
      if (!node) continue;

      const data = node.data as TechNodeData;
      const tfModule = getModule(data.moduleId);
      if (!tfModule) continue;

      const basePath = entry.path.replace(/\/[^/]+$/, '');
      const fileName = entry.path.split('/').pop() || '';

      if (fileName !== 'main.tf') continue;

      const depBlocks = getDependencyBlocks(node.id, depGraph);

      files.push({
        path: `${basePath}/main.tf`,
        content: renderMainTf(tfModule, data.terraformInputs || {}),
        type: 'tf',
      });

      files.push({
        path: `${basePath}/variables.tf`,
        content: renderVariablesTf(tfModule.inputs),
        type: 'tf',
      });

      files.push({
        path: `${basePath}/outputs.tf`,
        content: renderOutputsTf(tfModule.outputs),
        type: 'tf',
      });

      files.push({
        path: `${basePath}/terragrunt.hcl`,
        content: renderTerragruntHcl(
          tfModule,
          data.terraformInputs || {},
          data.terraformSecrets || {},
          depBlocks,
        ),
        type: 'hcl',
      });
    }

    return { files, folderTree, validationMessages };
  }, [nodes, edges, globalConfig]);

  const setMessages = useValidationStore((s) => s.setMessages);
  useEffect(() => {
    setMessages(result.validationMessages);
  }, [result.validationMessages, setMessages]);

  return result;
};
