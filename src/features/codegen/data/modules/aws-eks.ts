import type { TerraformModule } from '../../types';

export const awsEksModule: TerraformModule = {
  id: 'aws-eks',
  category: 'containers',
  resourceBlocks: [
    {
      resourceType: 'aws_eks_cluster',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'cluster_name' },
        { attribute: 'role_arn', fromInput: 'role_arn' },
        { attribute: 'version', fromInput: 'kubernetes_version' },
      ],
    },
  ],
  inputs: [
    { name: 'cluster_name', type: 'string', required: true, description: 'EKS cluster name' },
    { name: 'role_arn', type: 'string', required: false, description: 'IAM role ARN for the cluster' },
    { name: 'kubernetes_version', type: 'string', default: '1.31', required: false, description: 'Kubernetes version' },
  ],
  outputs: [
    { name: 'cluster_arn', description: 'EKS cluster ARN', terraformExpression: 'aws_eks_cluster.this.arn' },
    { name: 'cluster_endpoint', description: 'Cluster API endpoint', terraformExpression: 'aws_eks_cluster.this.endpoint' },
    { name: 'cluster_name', description: 'Cluster name', terraformExpression: 'aws_eks_cluster.this.name' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
  implicitDependencies: ['aws-vpc'],
};
