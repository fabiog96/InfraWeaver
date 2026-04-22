export { resolveRelationships } from './relationship-resolver';
export type { ResolveResult } from './relationship-resolver';
export { resolveTerragruntDependencies } from './terragrunt-resolver';
export type { TerragruntResolveResult } from './terragrunt-resolver';
export { normalizeSourcePath, resolveModuleDefinition, buildModuleDefinitionMap } from './module-source-resolver';
export type {
  GraphNode,
  GraphEdge,
  DependencyGraph,
  NodeType,
  Provider,
  EdgeType,
  ModuleDefinition,
} from './types';
