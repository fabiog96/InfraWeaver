import { describe, expect, it } from 'vitest';

import { cloudfrontS3Module } from '@/features/packaged-modules/data/cloudfront-s3';
import { serverlessApiModule } from '@/features/packaged-modules/data/serverless-api';
import type { PackagedModule } from '@/features/packaged-modules/types';
import type { DiagramEdge, DiagramNode, GroupNode, TechNode } from '@/shared/types';
import { getModule } from '../data/module-registry';
import type { GlobalConfig } from '../types';
import { buildDependencyGraph, getDependencyBlocks } from './dependency-resolver';
import { flattenFiles, generateFolderStructure } from './folder-structure-generator';
import { renderMainTf } from './hcl-renderer';
import { renderOutputsTf } from './outputs-renderer';
import { renderCommonHcl, renderRootTerragruntHcl } from './root-renderer';
import { renderTerragruntHcl } from './terragrunt-renderer';
import { renderVariablesTf } from './variables-renderer';

interface Diagram {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

interface EmittedFile {
  path: string;
  content: string;
}

const globalConfig: GlobalConfig = {
  region: 'eu-west-1',
  environment: 'prod',
  project: 'infraweaver',
  subproject: 'platform',
  stateBucket: 'infraweaver-tfstate',
  lockTable: 'infraweaver-tflock',
  cicdProvider: 'none',
};

const defaultInputsOf = (moduleId: string): Record<string, unknown> =>
  Object.fromEntries(
    (getModule(moduleId)?.inputs ?? [])
      .filter((input) => input.default !== undefined)
      .map((input) => [input.name, input.default]),
  );

const toGroupNode = (pkg: PackagedModule): GroupNode | undefined => {
  if (!pkg.group) return undefined;

  return {
    id: `${pkg.id}-group`,
    type: 'group',
    position: { x: 0, y: 0 },
    data: {
      label: pkg.group.label,
      color: '#6366f1',
      folderName: pkg.group.folderName,
    },
  };
};

const toTechNodes = (pkg: PackagedModule, parentId: string | undefined): TechNode[] =>
  pkg.nodes.map((pkgNode) => ({
    id: `${pkg.id}-${pkgNode.relativeId}`,
    type: 'tech',
    position: pkgNode.position,
    parentId,
    data: {
      label: pkgNode.label,
      provider: 'aws',
      serviceType: pkgNode.serviceId,
      icon: pkgNode.serviceId,
      status: 'none',
      color: '#6366f1',
      notes: '',
      moduleId: pkgNode.serviceId,
      terraformInputs: { ...defaultInputsOf(pkgNode.serviceId), ...pkgNode.terraformInputs },
      terraformSecrets: {},
    },
  }));

const toEdges = (pkg: PackagedModule): DiagramEdge[] =>
  pkg.edges.map((edge) => ({
    id: `${pkg.id}-edge-${edge.sourceRelativeId}-${edge.targetRelativeId}`,
    source: `${pkg.id}-${edge.sourceRelativeId}`,
    target: `${pkg.id}-${edge.targetRelativeId}`,
    type: 'smart',
    data: { label: edge.label, lineStyle: 'solid' },
  }));

const dropPackagedModule = (pkg: PackagedModule): Diagram => {
  const group = toGroupNode(pkg);
  const techNodes = toTechNodes(pkg, group?.id);

  return {
    nodes: group ? [group, ...techNodes] : techNodes,
    edges: toEdges(pkg),
  };
};

const generateProject = ({ nodes, edges }: Diagram): EmittedFile[] => {
  const folderTree = generateFolderStructure(nodes);
  const dependencyGraph = buildDependencyGraph(nodes, edges, folderTree);

  const files: EmittedFile[] = [
    { path: 'infrastructure-live/terragrunt.hcl', content: renderRootTerragruntHcl(globalConfig) },
    { path: 'infrastructure-live/_env/common.hcl', content: renderCommonHcl() },
  ];

  for (const entry of flattenFiles(folderTree)) {
    if (!entry.path.endsWith('/main.tf')) continue;

    const node = nodes.find((candidate) => candidate.id === entry.nodeId);
    if (node?.type !== 'tech') continue;

    const tfModule = getModule(node.data.moduleId);
    if (!tfModule) continue;

    const directory = entry.path.replace(/\/main\.tf$/, '');
    const { terraformInputs, terraformSecrets } = node.data;

    files.push(
      { path: `${directory}/main.tf`, content: renderMainTf(tfModule, terraformInputs) },
      { path: `${directory}/variables.tf`, content: renderVariablesTf(tfModule.inputs) },
      { path: `${directory}/outputs.tf`, content: renderOutputsTf(tfModule.outputs) },
      {
        path: `${directory}/terragrunt.hcl`,
        content: renderTerragruntHcl(
          tfModule,
          terraformInputs,
          terraformSecrets,
          getDependencyBlocks(node.id, dependencyGraph),
        ),
      },
    );
  }

  return files;
};

const asDocument = (files: EmittedFile[]): string =>
  files.map((file) => `===== ${file.path} =====\n${file.content}`).join('\n');

const withoutDeliberateSecretMarkers = (document: string): string =>
  document.replace(/"PLACEHOLDER_USE_(SECRET_MANAGER|SSM_PARAMETER)".*$/gm, '');

const packagedModules: PackagedModule[] = [serverlessApiModule, cloudfrontS3Module];

describe.each(packagedModules)('$id project generation', (pkg) => {
  const files = generateProject(dropPackagedModule(pkg));
  const document = asDocument(files);

  it('resolves every packaged node to a registered terraform module', () => {
    const unresolved = pkg.nodes.filter((node) => !getModule(node.serviceId));

    expect(unresolved.map((node) => node.serviceId)).toEqual([]);
  });

  it('emits the four terraform files per node plus the two root files', () => {
    const paths = files.map((file) => file.path);

    expect(files).toHaveLength(2 + pkg.nodes.length * 4);
    expect(paths).toContain('infrastructure-live/terragrunt.hcl');
    expect(paths).toContain('infrastructure-live/_env/common.hcl');
  });

  it('matches the generated project snapshot', () => {
    expect(document).toMatchSnapshot();
  });

  it('leaves no unresolved placeholder in the generated hcl', () => {
    expect(document).not.toMatch(/\bundefined\b/);
    expect(document).not.toMatch(/\bnull\b/);
    expect(document).not.toMatch(/\bNaN\b/);
    expect(document).not.toContain('TODO');
    expect(withoutDeliberateSecretMarkers(document)).not.toContain('PLACEHOLDER');
  });

  it('never emits an empty attribute value', () => {
    for (const file of files) {
      expect(file.content, file.path).not.toMatch(/^\s*\S+\s*=\s*$/m);
    }
  });
});
