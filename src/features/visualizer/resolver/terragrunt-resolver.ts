import type { TerragruntConfig, ParseError } from '../parser/types';
import type { GraphEdge } from './types';

/**
 * Extracts the layer name from a Terragrunt dependency config path.
 * Handles both relative paths ("../020-messaging") and full paths.
 *
 * @example
 * extractLayerFromPath('../020-messaging')          // → '020-messaging'
 * extractLayerFromPath('../050-integrations')       // → '050-integrations'
 * extractLayerFromPath('${get_terragrunt_dir()}/../000-commons') // → '000-commons'
 */
const extractLayerFromPath = (configPath: string): string => {
  const segments = configPath.replace(/\/+$/, '').split('/');
  return segments[segments.length - 1] ?? configPath;
};

/**
 * Builds a synthetic node ID for a Terragrunt layer.
 * Used to create edges between layers in the dependency graph.
 *
 * @example
 * layerNodeId('070-microservices') // → 'layer.070-microservices'
 * layerNodeId('020-messaging')     // → 'layer.020-messaging'
 */
const layerNodeId = (layer: string): string => `layer.${layer}`;

export interface TerragruntResolveResult {
  edges: GraphEdge[];
  layerDependencies: Map<string, string[]>;
  errors: ParseError[];
}

/**
 * Resolves Terragrunt dependency configurations into cross-layer edges
 * for the dependency graph.
 *
 * Processes each Terragrunt config's `dependency` blocks to create edges
 * with type "terragrunt". The edge label includes the output names consumed
 * from the dependency. Also builds a layer dependency map showing which
 * layers depend on which.
 *
 * @example
 * // Given two Terragrunt configs:
 * // - 070-microservices.hcl: dependency "messaging" { config_path = "../020-messaging" }
 * //   with inputs referencing dependency.messaging.outputs.campaign_proximity_topic_arn
 * // - 090-dwh.hcl: dependency "integrations" { config_path = "../050-integrations" }
 *
 * const { edges, layerDependencies } = resolveTerragruntDependencies(configs);
 *
 * // edges → [
 * //   {
 * //     id: 'tg:070-microservices→020-messaging',
 * //     source: 'layer.070-microservices',
 * //     target: 'layer.020-messaging',
 * //     label: 'campaign_proximity_topic_arn',
 * //     type: 'terragrunt',
 * //   },
 * //   {
 * //     id: 'tg:090-dwh→050-integrations',
 * //     source: 'layer.090-dwh',
 * //     target: 'layer.050-integrations',
 * //     label: '',
 * //     type: 'terragrunt',
 * //   },
 * // ]
 * //
 * // layerDependencies → Map {
 * //   '070-microservices' → ['020-messaging'],
 * //   '090-dwh'          → ['050-integrations'],
 * // }
 */
export const resolveTerragruntDependencies = (
  configs: TerragruntConfig[],
): TerragruntResolveResult => {
  const edges: GraphEdge[] = [];
  const layerDependencies = new Map<string, string[]>();
  const errors: ParseError[] = [];
  const edgeDedup = new Set<string>();

  for (const config of configs) {
    const sourceLayer = inferLayerFromTerragruntPath(config.filePath);
    if (!sourceLayer) continue;

    const deps: string[] = [];

    for (const dep of config.dependencies) {
      const targetLayer = extractLayerFromPath(dep.configPath);
      if (!targetLayer || targetLayer === sourceLayer) continue;

      deps.push(targetLayer);

      const edgeKey = `tg:${sourceLayer}→${targetLayer}`;
      if (edgeDedup.has(edgeKey)) continue;
      edgeDedup.add(edgeKey);

      edges.push({
        id: edgeKey,
        source: layerNodeId(sourceLayer),
        target: layerNodeId(targetLayer),
        label: dep.outputs.join(', '),
        type: 'terragrunt',
      });
    }

    for (const depPath of config.dependencyPaths) {
      const targetLayer = extractLayerFromPath(depPath);
      if (!targetLayer || targetLayer === sourceLayer) continue;

      if (!deps.includes(targetLayer)) {
        deps.push(targetLayer);
      }

      const edgeKey = `tg:${sourceLayer}→${targetLayer}`;
      if (edgeDedup.has(edgeKey)) continue;
      edgeDedup.add(edgeKey);

      edges.push({
        id: edgeKey,
        source: layerNodeId(sourceLayer),
        target: layerNodeId(targetLayer),
        label: '',
        type: 'terragrunt',
      });
    }

    if (deps.length > 0) {
      const existing = layerDependencies.get(sourceLayer) ?? [];
      layerDependencies.set(sourceLayer, [...new Set([...existing, ...deps])]);
    }
  }

  return { edges, layerDependencies, errors };
};

/**
 * Infers the Terragrunt layer name from a config file path.
 * Looks for the NNN-name directory pattern or known directory names.
 *
 * @example
 * inferLayerFromTerragruntPath('infra/_env/070-microservices.hcl')
 * // → '070-microservices'
 *
 * inferLayerFromTerragruntPath('infra/prod/020-messaging/terragrunt.hcl')
 * // → '020-messaging'
 *
 * inferLayerFromTerragruntPath('infra/root.hcl')
 * // → undefined
 */
const inferLayerFromTerragruntPath = (filePath: string): string | undefined => {
  const envMatch = /\/_env\/(\d{3}-[\w-]+)\.hcl$/.exec(filePath);
  if (envMatch) return envMatch[1];

  const dirMatch = /\/(\d{3}-[\w-]+)\/terragrunt\.hcl$/.exec(filePath);
  if (dirMatch) return dirMatch[1];

  return undefined;
};
