import type { ParsedFile, ParsedResource, ParseError } from '../parser/types';
import type { GraphNode, GraphEdge, Provider, NodeType } from './types';
import { normalizeSourcePath } from './module-source-resolver';

/**
 * Detects the cloud provider from a Terraform resource type string.
 *
 * @example
 * detectProvider('aws_lambda_function')   // → 'aws'
 * detectProvider('google_project')        // → 'gcp'
 * detectProvider('azurerm_storage_blob')  // → 'azure'
 * detectProvider('null_resource')         // → 'generic'
 */
const detectProvider = (resourceType: string): Provider => {
  if (resourceType.startsWith('aws_')) return 'aws';
  if (resourceType.startsWith('google_') || resourceType.startsWith('google-beta_')) return 'gcp';
  if (resourceType.startsWith('azurerm_')) return 'azure';
  return 'generic';
};

/**
 * Converts an AWS/GCP/Azure resource type into a human-readable service name.
 * Strips the provider prefix and replaces underscores with spaces.
 *
 * @example
 * toServiceType('aws_lambda_function')     // → 'lambda function'
 * toServiceType('aws_dynamodb_table')      // → 'dynamodb table'
 * toServiceType('google_project_service')  // → 'project service'
 */
const toServiceType = (resourceType: string): string => {
  return resourceType
    .replace(/^(aws|google|google-beta|azurerm)_/, '')
    .replace(/_/g, ' ');
};

/**
 * Attempts to infer the project name from a file path or resource name.
 * Uses known project prefixes from the devops-farm-tf naming convention.
 *
 * @example
 * inferProject('resources/070-microservices/campaign-proximity.tf', 'campaign_proximity_service')
 * // → 'campaign-proximity'
 *
 * inferProject('resources/070-microservices/adklab-cognito.tf', 'adklab')
 * // → 'adklab'
 *
 * inferProject('resources/000-commons/apis.tf', 'project')
 * // → undefined
 */
const inferProject = (filePath: string, name: string): string | undefined => {
  const fileName = filePath.split('/').pop()?.replace(/\.tf$/, '') ?? '';

  if (fileName.includes('-')) {
    const parts = fileName.split('-');
    if (parts.length >= 2) {
      const candidate = parts.slice(0, -1).join('-');
      if (candidate !== 'terraform' && candidate !== 'locals' && candidate !== 'variables') {
        return candidate;
      }
    }
    return fileName;
  }

  const nameKebab = name.replace(/_/g, '-');
  if (nameKebab.includes('-')) {
    const parts = nameKebab.split('-');
    if (parts.length >= 2) {
      return parts.slice(0, -1).join('-');
    }
  }

  return undefined;
};

/**
 * Extracts the layer identifier from a file path based on directory naming convention.
 * Layers follow the pattern NNN-name (e.g. "070-microservices", "020-messaging").
 *
 * @example
 * inferLayer('resources/070-microservices/campaign-proximity.tf')
 * // → '070-microservices'
 *
 * inferLayer('resources/shared/ecr.tf')
 * // → 'shared'
 *
 * inferLayer('utils/modules/api-gateway-lambda/lambda.tf')
 * // → undefined
 */
const inferLayer = (filePath: string): string | undefined => {
  const match = /(?:resources|infra)\/(?:[\w-]+\/)?(\d{3}-[\w-]+|main|shared)/.exec(filePath);
  return match?.[1];
};

/**
 * Builds a unique graph node ID from a parsed resource.
 * The ID encodes the block type, resource type, and name to ensure uniqueness.
 *
 * @example
 * buildNodeId({ type: 'resource', resourceType: 'aws_s3_bucket', name: 'my_bucket' })
 * // → 'resource.aws_s3_bucket.my_bucket'
 *
 * buildNodeId({ type: 'module', resourceType: 'module', name: 'api_service' })
 * // → 'module.api_service'
 *
 * buildNodeId({ type: 'data', resourceType: 'aws_ecr_repository', name: 'repo' })
 * // → 'data.aws_ecr_repository.repo'
 */
const buildNodeId = (resource: ParsedResource): string => {
  if (resource.type === 'module') return `module.${resource.name}`;
  if (resource.type === 'data') return `data.${resource.resourceType}.${resource.name}`;
  return `resource.${resource.resourceType}.${resource.name}`;
};

/**
 * Determines if a parsed resource should become a visible node in the dependency graph.
 * Only resources, modules, and data sources produce nodes — variables, outputs,
 * and locals are consumed as metadata but not rendered.
 */
const isGraphNode = (resource: ParsedResource): boolean => {
  return resource.type === 'resource' || resource.type === 'module' || resource.type === 'data';
};

/**
 * Converts a parsed resource block into a GraphNode for the dependency graph.
 * Enriches the node with inferred metadata: provider, service type, layer, project,
 * and module source path (for composite icon mapping in D8).
 *
 * @example
 * // A module block using api-gateway-lambda produces:
 * // {
 * //   id: 'module.campaign_proximity_service',
 * //   type: 'module',
 * //   provider: 'aws',
 * //   serviceType: 'api-gateway-lambda',
 * //   label: 'campaign_proximity_service',
 * //   layer: '070-microservices',
 * //   project: 'campaign-proximity',
 * //   moduleSource: 'api-gateway-lambda',
 * //   ...
 * // }
 */
const toGraphNode = (resource: ParsedResource): GraphNode => {
  const nodeType: NodeType = resource.type as NodeType;

  let provider: Provider = 'generic';
  let serviceType = resource.resourceType;

  if (resource.type === 'module') {
    const source = resource.source ? normalizeSourcePath(resource.source) : 'module';
    serviceType = source;
    if (
      source.startsWith('aws-') ||
      source.includes('lambda') ||
      source.includes('gateway') ||
      source.includes('s3') ||
      source.includes('cloudfront') ||
      source.includes('ecs') ||
      source.includes('sqs') ||
      source.includes('sns') ||
      source.includes('dynamodb')
    ) {
      provider = 'aws';
    }
  } else {
    provider = detectProvider(resource.resourceType);
    serviceType = toServiceType(resource.resourceType);
  }

  return {
    id: buildNodeId(resource),
    type: nodeType,
    provider,
    serviceType,
    label: resource.name,
    layer: inferLayer(resource.filePath),
    project: inferProject(resource.filePath, resource.name),
    filePath: resource.filePath,
    lineStart: resource.lineStart,
    moduleSource: resource.type === 'module' && resource.source
      ? normalizeSourcePath(resource.source)
      : undefined,
  };
};

/**
 * Resolves a raw reference string (extracted by the parser) into a target node ID.
 * Handles the different reference formats used in Terraform:
 * - `var.x` and `local.x` are skipped (not graph nodes)
 * - `module.name.output` → `module.name`
 * - `data.type.name.attr` → `data.type.name`
 * - `aws_type.name.attr` → `resource.aws_type.name`
 *
 * Returns null if the reference does not point to a graph-visible node.
 *
 * @example
 * resolveReferenceTarget('aws_dynamodb_table.campaign.arn', nodeIndex)
 * // → 'resource.aws_dynamodb_table.campaign' (if it exists in nodeIndex)
 *
 * resolveReferenceTarget('module.api_service.api_gateway_url', nodeIndex)
 * // → 'module.api_service'
 *
 * resolveReferenceTarget('var.env', nodeIndex)
 * // → null (variables are not graph nodes)
 */
const resolveReferenceTarget = (
  ref: string,
  nodeIndex: Map<string, boolean>,
): string | null => {
  if (ref.startsWith('var.') || ref.startsWith('local.')) return null;

  if (ref.startsWith('module.')) {
    const parts = ref.split('.');
    const candidateId = `module.${parts[1]}`;
    return nodeIndex.has(candidateId) ? candidateId : null;
  }

  if (ref.startsWith('data.')) {
    const parts = ref.split('.');
    if (parts.length >= 3) {
      const candidateId = `data.${parts[1]}.${parts[2]}`;
      return nodeIndex.has(candidateId) ? candidateId : null;
    }
    return null;
  }

  const parts = ref.split('.');
  if (parts.length >= 2) {
    const candidateId = `resource.${parts[0]}.${parts[1]}`;
    return nodeIndex.has(candidateId) ? candidateId : null;
  }

  return null;
};

/**
 * Extracts a human-readable label for an edge from a reference string.
 * Uses the last segment of the reference (typically the attribute name).
 *
 * @example
 * extractEdgeLabel('aws_dynamodb_table.campaign.arn')            // → 'arn'
 * extractEdgeLabel('module.api_service.api_gateway_url')         // → 'api_gateway_url'
 * extractEdgeLabel('data.aws_ecr_repository.repo.repository_url') // → 'repository_url'
 */
const extractEdgeLabel = (ref: string): string => {
  const parts = ref.split('.');
  return parts[parts.length - 1] ?? ref;
};

export interface ResolveResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
  errors: ParseError[];
}

/**
 * Resolves all cross-resource references from parsed HCL files into a dependency graph.
 *
 * For each resource/module/data block, creates a GraphNode. Then for each reference
 * found in a block's attributes, attempts to resolve it to a target node and creates
 * a GraphEdge. Unresolvable references that look like they should match a node
 * produce a `resolve_error` in the errors array.
 *
 * @example
 * // Given parsed files from resources/070-microservices/:
 * // - campaign-proximity.tf with module "campaign_proximity_service" referencing
 * //   aws_dynamodb_table.campaign_proximity, aws_cognito_user_pool.adklab, etc.
 *
 * const { nodes, edges, errors } = resolveRelationships(parsedFiles);
 * // nodes → [
 * //   { id: 'module.campaign_proximity_service', type: 'module', serviceType: 'api-gateway-lambda', ... },
 * //   { id: 'resource.aws_dynamodb_table.campaign_proximity', type: 'resource', ... },
 * //   { id: 'resource.aws_cognito_user_pool.adklab', type: 'resource', ... },
 * //   ...
 * // ]
 * // edges → [
 * //   { source: 'module.campaign_proximity_service', target: 'resource.aws_dynamodb_table.campaign_proximity', label: 'arn', type: 'explicit' },
 * //   { source: 'module.campaign_proximity_service', target: 'resource.aws_cognito_user_pool.adklab', label: 'id', type: 'explicit' },
 * //   ...
 * // ]
 */
export const resolveRelationships = (files: ParsedFile[]): ResolveResult => {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const errors: ParseError[] = [];
  const nodeIndex = new Map<string, boolean>();
  const edgeDedup = new Set<string>();

  for (const file of files) {
    for (const resource of file.resources) {
      if (!isGraphNode(resource)) continue;

      const node = toGraphNode(resource);
      if (!nodeIndex.has(node.id)) {
        nodes.push(node);
        nodeIndex.set(node.id, true);
      }
    }
  }

  for (const file of files) {
    for (const resource of file.resources) {
      if (!isGraphNode(resource)) continue;

      const sourceId = buildNodeId(resource);

      for (const ref of resource.references) {
        const targetId = resolveReferenceTarget(ref, nodeIndex);

        if (!targetId) continue;
        if (targetId === sourceId) continue;

        const edgeKey = `${sourceId}→${targetId}`;
        if (edgeDedup.has(edgeKey)) continue;
        edgeDedup.add(edgeKey);

        edges.push({
          id: edgeKey,
          source: sourceId,
          target: targetId,
          label: extractEdgeLabel(ref),
          type: 'explicit',
        });
      }
    }
  }

  return { nodes, edges, errors };
};
