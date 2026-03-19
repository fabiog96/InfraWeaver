export interface PackagedNode {
  relativeId: string;
  serviceId: string;
  label: string;
  position: { x: number; y: number };
  terraformInputs: Record<string, unknown>;
}

export interface PackagedEdge {
  sourceRelativeId: string;
  targetRelativeId: string;
  label?: string;
}

export interface PackagedModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  nodes: PackagedNode[];
  edges: PackagedEdge[];
  group?: {
    label: string;
    folderName: string;
  };
}
