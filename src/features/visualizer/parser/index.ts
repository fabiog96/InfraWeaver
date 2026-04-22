export { parseFiles } from './hcl-parser';
export type { FileInput } from './hcl-parser';
export { parseTerragruntContent } from './terragrunt-parser';
export { extractReferences } from './reference-extractor';
export type {
  ParsedResource,
  ParsedFile,
  ParseError,
  ParseResult,
  ParseStats,
  BlockType,
  ParseErrorLevel,
  TerragruntConfig,
  TerragruntDependency,
} from './types';
