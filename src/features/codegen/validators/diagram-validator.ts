import type { Node, Edge } from '@xyflow/react';

import type { TechNodeData, OutputMapping } from '@/shared/types';
import { getModule } from '../data/module-registry';
import type { DependencyGraph, CycleError } from '../generators/dependency-resolver';
import { detectCycles } from '../generators/dependency-resolver';

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationMessage {
  severity: ValidationSeverity;
  message: string;
  nodeId?: string;
  edgeId?: string;
}

export type NodeValidationStatus = 'valid' | 'warning' | 'error' | null;

export const validateDiagram = (
  nodes: Node[],
  edges: Edge[],
  graph: DependencyGraph,
): ValidationMessage[] => {
  const messages: ValidationMessage[] = [];

  messages.push(...validateRequiredInputs(nodes));
  messages.push(...validateCycles(graph));
  messages.push(...validateMixedModuleEdges(nodes, edges));
  messages.push(...validateImplicitDependencies(nodes));
  messages.push(...validateOutputMappings(nodes, edges));
  messages.push(...validateUngroupedNodes(nodes));

  return messages;
};

const validateRequiredInputs = (nodes: Node[]): ValidationMessage[] => {
  const messages: ValidationMessage[] = [];

  for (const node of nodes) {
    if (node.type !== 'tech') continue;
    const data = node.data as TechNodeData;
    if (!data.moduleId) continue;

    const tfModule = getModule(data.moduleId);
    if (!tfModule) continue;

    for (const input of tfModule.inputs) {
      if (!input.required) continue;
      if (input.default !== undefined) continue;

      const value = data.terraformInputs?.[input.name];
      if (value === undefined || value === null || value === '') {
        messages.push({
          severity: 'error',
          message: `"${data.label}": required input "${input.name}" is not set`,
          nodeId: node.id,
        });
      }
    }
  }

  return messages;
};

const validateCycles = (graph: DependencyGraph): ValidationMessage[] => {
  const cycles: CycleError[] = detectCycles(graph);
  const messages: ValidationMessage[] = [];

  for (const c of cycles) {
    for (const nodeId of c.cycle.slice(0, -1)) {
      messages.push({
        severity: 'error',
        message: c.message,
        nodeId,
      });
    }
  }

  return messages;
};

const validateMixedModuleEdges = (nodes: Node[], edges: Edge[]): ValidationMessage[] => {
  const messages: ValidationMessage[] = [];

  for (const edge of edges) {
    const source = nodes.find((n) => n.id === edge.source);
    const target = nodes.find((n) => n.id === edge.target);
    if (!source || !target) continue;

    const sourceData = source.data as TechNodeData;
    const targetData = target.data as TechNodeData;

    const sourceHasModule = source.type === 'tech' && !!sourceData.moduleId;
    const targetHasModule = target.type === 'tech' && !!targetData.moduleId;

    if ((sourceHasModule && !targetHasModule) || (!sourceHasModule && targetHasModule)) {
      const nodeWithout = sourceHasModule ? target : source;
      messages.push({
        severity: 'warning',
        message: `"${(nodeWithout.data as TechNodeData).label}" has no Terraform module but is connected to a module node`,
        nodeId: nodeWithout.id,
      });
    }
  }

  return messages;
};

const validateImplicitDependencies = (nodes: Node[]): ValidationMessage[] => {
  const messages: ValidationMessage[] = [];
  const moduleIds = new Set<string>();

  for (const node of nodes) {
    if (node.type !== 'tech') continue;
    const data = node.data as TechNodeData;
    if (data.moduleId) moduleIds.add(data.moduleId);
  }

  for (const node of nodes) {
    if (node.type !== 'tech') continue;
    const data = node.data as TechNodeData;
    if (!data.moduleId) continue;

    const tfModule = getModule(data.moduleId);
    if (!tfModule?.implicitDependencies) continue;

    for (const dep of tfModule.implicitDependencies) {
      if (!moduleIds.has(dep)) {
        messages.push({
          severity: 'warning',
          message: `"${data.label}" typically requires "${dep}" but none found on canvas`,
          nodeId: node.id,
        });
      }
    }
  }

  return messages;
};

const validateOutputMappings = (nodes: Node[], edges: Edge[]): ValidationMessage[] => {
  const messages: ValidationMessage[] = [];

  for (const edge of edges) {
    const edgeData = edge.data as { outputMapping?: OutputMapping[] } | undefined;
    if (!edgeData?.outputMapping || edgeData.outputMapping.length === 0) continue;

    const source = nodes.find((n) => n.id === edge.source);
    const target = nodes.find((n) => n.id === edge.target);
    if (!source || !target) continue;

    const sourceData = source.data as TechNodeData;
    const targetData = target.data as TechNodeData;

    const sourceModule = getModule(sourceData.moduleId);
    const targetModule = getModule(targetData.moduleId);
    if (!sourceModule || !targetModule) continue;

    for (const mapping of edgeData.outputMapping) {
      const outputExists = sourceModule.outputs.some((o) => o.name === mapping.sourceOutput);
      const inputExists = targetModule.inputs.some((i) => i.name === mapping.targetInput);

      if (!outputExists || !inputExists) {
        messages.push({
          severity: 'warning',
          message: `Invalid mapping on edge "${edge.id}": ${mapping.sourceOutput} -> ${mapping.targetInput}`,
          edgeId: edge.id,
        });
      }
    }
  }

  return messages;
};

const validateUngroupedNodes = (nodes: Node[]): ValidationMessage[] => {
  const messages: ValidationMessage[] = [];

  for (const node of nodes) {
    if (node.type !== 'tech') continue;
    const data = node.data as TechNodeData;
    if (!data.moduleId) continue;
    if (node.parentId) continue;

    messages.push({
      severity: 'info',
      message: `"${data.label}" is not inside a group — it will be placed in a category-based folder`,
      nodeId: node.id,
    });
  }

  return messages;
};

export const getNodeValidationStatus = (
  nodeId: string,
  messages: ValidationMessage[],
): NodeValidationStatus => {
  const nodeMessages = messages.filter((m) => m.nodeId === nodeId);
  if (nodeMessages.some((m) => m.severity === 'error')) return 'error';
  if (nodeMessages.some((m) => m.severity === 'warning')) return 'warning';
  return null;
};

export const getEdgeValidationStatus = (
  edgeId: string,
  messages: ValidationMessage[],
): NodeValidationStatus => {
  const edgeMessages = messages.filter((m) => m.edgeId === edgeId);
  if (edgeMessages.some((m) => m.severity === 'error')) return 'error';
  if (edgeMessages.some((m) => m.severity === 'warning')) return 'warning';
  return null;
};
