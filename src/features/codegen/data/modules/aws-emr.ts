import type { TerraformModule } from '../../types';

export const awsEmrModule: TerraformModule = {
  id: 'aws-emr',
  category: 'analytics',
  resourceBlocks: [
    {
      resourceType: 'aws_emr_cluster',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'cluster_name' },
        { attribute: 'release_label', fromInput: 'release_label' },
        { attribute: 'service_role', fromInput: 'service_role' },
      ],
      nestedBlocks: [
        {
          blockType: 'ec2_attributes',
          attributes: [
            { attribute: 'subnet_id', fromInput: 'subnet_id' },
            { attribute: 'instance_profile', fromInput: 'instance_profile' },
            { attribute: 'key_name', fromInput: 'key_name' },
          ],
        },
        {
          blockType: 'master_instance_group',
          attributes: [
            { attribute: 'instance_type', fromInput: 'master_instance_type' },
            { attribute: 'instance_count', fromInput: 'master_instance_count' },
          ],
        },
        {
          blockType: 'core_instance_group',
          attributes: [
            { attribute: 'instance_type', fromInput: 'core_instance_type' },
            { attribute: 'instance_count', fromInput: 'core_instance_count' },
          ],
        },
      ],
    },
  ],
  inputs: [
    { name: 'cluster_name', type: 'string', required: true, description: 'EMR cluster name' },
    { name: 'release_label', type: 'string', default: 'emr-7.0.0', required: false, description: 'EMR release label' },
    { name: 'service_role', type: 'string', required: true, description: 'IAM service role' },
    { name: 'instance_profile', type: 'string', required: true, description: 'EC2 instance profile' },
    { name: 'subnet_id', type: 'string', required: false, description: 'Subnet ID' },
    { name: 'key_name', type: 'string', required: false, description: 'EC2 key pair name' },
    { name: 'master_instance_type', type: 'string', default: 'm5.xlarge', required: false, description: 'Master instance type' },
    { name: 'master_instance_count', type: 'number', default: 1, required: false, description: 'Master instance count' },
    { name: 'core_instance_type', type: 'string', default: 'm5.xlarge', required: false, description: 'Core instance type' },
    { name: 'core_instance_count', type: 'number', default: 2, required: false, description: 'Core instance count' },
  ],
  outputs: [
    { name: 'cluster_id', description: 'Cluster ID', terraformExpression: 'aws_emr_cluster.this.id' },
    { name: 'master_public_dns', description: 'Master public DNS', terraformExpression: 'aws_emr_cluster.this.master_public_dns' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
  implicitDependencies: ['aws-vpc', 'aws-iam'],
};
