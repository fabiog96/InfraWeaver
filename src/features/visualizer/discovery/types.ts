export interface SubprojectInfo {
  name: string;
  resourceIds: string[];
  resourceCount: number;
}

export interface ProjectInfo {
  name: string;
  resourceCount: number;
  resourceIds: string[];
  subprojects: SubprojectInfo[];
  layers: string[];
  tagLocalName?: string;
}

export interface ModuleDefinitionInfo {
  name: string;
  sourcePath: string;
  internalResourceIds: string[];
  internalResourceTypes: string[];
  usedByProjects: string[];
  usedByCount: number;
}

export interface ProjectCatalog {
  projects: Map<string, ProjectInfo>;
  modules: Map<string, ModuleDefinitionInfo>;
  untaggedResourceIds: string[];
  totalTagged: number;
  totalUntagged: number;
}

export interface ResourceProjectMapping {
  resourceId: string;
  project: string | undefined;
  subproject: string | undefined;
}
