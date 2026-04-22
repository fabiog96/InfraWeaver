import type { Node, Edge } from '@xyflow/react';

export type CloudProvider = 'aws' | 'generic';

export type NodeStatus = 'healthy' | 'warning' | 'error' | 'none';
export interface TechNodeData extends Record<string, unknown> {
  label: string;
  provider: CloudProvider;
  serviceType: string;
  icon: string;
  status: NodeStatus;
  color: string;
  notes: string;
  moduleId: string;
  terraformInputs: Record<string, unknown>;
  terraformSecrets: Record<string, string>;
}

export interface GroupNodeData extends Record<string, unknown> {
  label: string;
  color: string;
  folderName: string;
  description?: string;
}
export interface TextNodeData extends Record<string,unknown>{
  content: string;
  fontSize: 'sm' | 'md'| 'lg';
  bgColor:string;
}

export type TextNode = Node<TextNodeData, 'text'>;                                                                                                                                                                                                 
export type TechNode = Node<TechNodeData, 'tech'>;
export type GroupNode = Node<GroupNodeData, 'group'>;
export type DiagramNode = TechNode | GroupNode | TextNode;

export type LineStyle = 'solid' | 'dashed' | 'dotted';

export interface OutputMapping {
  sourceOutput: string;
  targetInput: string;
}

export interface EdgeData extends Record<string, unknown> {
  label?: string;
  lineStyle?: LineStyle;
  outputMapping?: OutputMapping[];
}

export type DiagramEdge = Edge<EdgeData>;

export interface ServiceDefinition {
  id: string;
  label: string;
  provider: CloudProvider;
  serviceType: string;
  icon: string;
  category: string;
  defaultColor: string;
}

export type ExportFormat = 'png' | 'jpg' | 'json';