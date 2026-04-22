export type NodeType = 'resource' | 'module' | 'data';
export type Provider = 'aws' | 'generic';
export type EdgeType = 'explicit' | 'implicit' | 'terragrunt' | 'ghost';

export interface GraphNode {
  id: string;
  type: NodeType;
  provider: Provider;
  serviceType: string;
  label: string;
  layer?: string;
  project?: string;
  subproject?: string;
  filePath: string;
  lineStart: number;
  moduleSource?: string;
  isModuleInternal?: boolean;
  parentModule?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type: EdgeType;
}

export interface DependencyGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface ModuleDefinition {
  sourcePath: string;
  variables: string[];
  outputs: string[];
}
