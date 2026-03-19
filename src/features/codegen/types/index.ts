export type CicdProvider = 'github-actions' | 'gitlab-ci' | 'none';

export interface GlobalConfig {
  region: string;
  environment: string;
  project: string;
  subproject: string;
  stateBucket: string;
  lockTable: string;
  cicdProvider: CicdProvider;
}

export interface ModuleInput {
  name: string;
  type: 'string' | 'number' | 'bool' | 'list' | 'map';
  default?: unknown;
  description: string;
  required: boolean;
  options?: string[];
}

export interface ModuleOutput {
  name: string;
  description: string;
  terraformExpression: string;
}

export interface ModuleSecret {
  name: string;
  description: string;
  source: 'env' | 'secretsmanager' | 'ssm';
}

export interface AttributeMapping {
  attribute: string;
  fromInput: string;
}

export interface NestedBlock {
  blockType: string;
  attributes: AttributeMapping[];
}

export interface ResourceBlock {
  resourceType: string;
  resourceName: string;
  attributes: AttributeMapping[];
  nestedBlocks?: NestedBlock[];
}

export interface TerraformModule {
  id: string;
  category: string;
  resourceBlocks: ResourceBlock[];
  inputs: ModuleInput[];
  outputs: ModuleOutput[];
  secrets: ModuleSecret[];
  requiredProviders: string[];
  implicitDependencies?: string[];
}
