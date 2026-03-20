export type NodeType = 'resource' | 'module' | 'data';
export type Provider = 'aws' | 'gcp' | 'azure' | 'generic';
export type EdgeType = 'explicit' | 'implicit' | 'terragrunt';

export interface GraphNode {
  id: string;
  type: NodeType;
  provider: Provider;
  serviceType: string;
  label: string;
  layer?: string;
  project?: string;
  filePath: string;
  lineStart: number;
  moduleSource?: string;
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
