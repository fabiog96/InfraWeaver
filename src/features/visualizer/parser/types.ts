export type BlockType = 'resource' | 'module' | 'data' | 'variable' | 'output' | 'locals';

export interface ParsedResource {
  type: BlockType;
  resourceType: string;
  name: string;
  attributes: Record<string, unknown>;
  references: string[];
  source?: string;
  filePath: string;
  lineStart: number;
  lineEnd: number;
}

export interface ParsedFile {
  path: string;
  content: string;
  resources: ParsedResource[];
}

export type ParseErrorLevel = 'file_error' | 'parse_error' | 'resolve_error';

export interface ParseError {
  level: ParseErrorLevel;
  filePath: string;
  line?: number;
  column?: number;
  message: string;
  snippet?: string;
  suggestion?: string;
}

export interface ParseStats {
  totalFiles: number;
  parsedFiles: number;
  skippedFiles: number;
  totalResources: number;
  totalErrors: number;
}

export interface ParseResult {
  files: ParsedFile[];
  errors: ParseError[];
  stats: ParseStats;
}

export type TerragruntBlockType = 'include' | 'dependency' | 'dependencies' | 'terraform' | 'inputs' | 'generate' | 'remote_state' | 'locals';

export interface TerragruntDependency {
  name: string;
  configPath: string;
  outputs: string[];
}

export interface TerragruntConfig {
  filePath: string;
  terraformSource?: string;
  dependencies: TerragruntDependency[];
  dependencyPaths: string[];
  inputs: Record<string, unknown>;
  includes: Record<string, string>;
}
