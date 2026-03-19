import type { TerraformModule } from '../../types';

export const awsElasticacheModule: TerraformModule = {
  id: 'aws-elasticache',
  category: 'database',
  resourceBlocks: [
    {
      resourceType: 'aws_elasticache_cluster',
      resourceName: 'this',
      attributes: [
        { attribute: 'cluster_id', fromInput: 'cluster_id' },
        { attribute: 'engine', fromInput: 'engine' },
        { attribute: 'node_type', fromInput: 'node_type' },
        { attribute: 'num_cache_nodes', fromInput: 'num_cache_nodes' },
        { attribute: 'port', fromInput: 'port' },
      ],
    },
  ],
  inputs: [
    { name: 'cluster_id', type: 'string', required: true, description: 'Cluster identifier' },
    { name: 'engine', type: 'string', default: 'redis', required: false, description: 'Cache engine', options: ['redis', 'memcached'] },
    { name: 'node_type', type: 'string', default: 'cache.t4g.micro', required: false, description: 'Node type', options: [
      'cache.t4g.micro', 'cache.t4g.small', 'cache.t4g.medium',
      'cache.t3.micro', 'cache.t3.small', 'cache.t3.medium',
      'cache.r7g.large', 'cache.r7g.xlarge', 'cache.r7g.2xlarge', 'cache.r7g.4xlarge',
      'cache.r6g.large', 'cache.r6g.xlarge', 'cache.r6g.2xlarge', 'cache.r6g.4xlarge',
      'cache.m7g.large', 'cache.m7g.xlarge', 'cache.m7g.2xlarge', 'cache.m7g.4xlarge',
    ] },
    { name: 'num_cache_nodes', type: 'number', default: 1, required: false, description: 'Number of cache nodes' },
    { name: 'port', type: 'number', default: 6379, required: false, description: 'Port number' },
  ],
  outputs: [
    { name: 'cluster_address', description: 'Cluster address', terraformExpression: 'aws_elasticache_cluster.this.cluster_address' },
    { name: 'cache_nodes', description: 'Cache nodes', terraformExpression: 'aws_elasticache_cluster.this.cache_nodes' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
  implicitDependencies: ['aws-vpc'],
};
