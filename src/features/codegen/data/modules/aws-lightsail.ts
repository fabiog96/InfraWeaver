import type { TerraformModule } from '../../types';

export const awsLightsailModule: TerraformModule = {
  id: 'aws-lightsail',
  category: 'compute',
  resourceBlocks: [
    {
      resourceType: 'aws_lightsail_instance',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'instance_name' },
        { attribute: 'availability_zone', fromInput: 'availability_zone' },
        { attribute: 'blueprint_id', fromInput: 'blueprint_id' },
        { attribute: 'bundle_id', fromInput: 'bundle_id' },
      ],
    },
  ],
  inputs: [
    { name: 'instance_name', type: 'string', required: true, description: 'Lightsail instance name' },
    { name: 'availability_zone', type: 'string', required: true, description: 'Availability zone' },
    { name: 'blueprint_id', type: 'string', default: 'amazon_linux_2', required: false, description: 'Blueprint ID', options: ['amazon_linux_2', 'ubuntu_22_04', 'debian_12', 'wordpress', 'lamp_8', 'nodejs', 'nginx'] },
    { name: 'bundle_id', type: 'string', default: 'nano_3_0', required: false, description: 'Bundle ID (instance plan)', options: ['nano_3_0', 'micro_3_0', 'small_3_0', 'medium_3_0', 'large_3_0', 'xlarge_3_0', '2xlarge_3_0'] },
  ],
  outputs: [
    { name: 'instance_arn', description: 'Instance ARN', terraformExpression: 'aws_lightsail_instance.this.arn' },
    { name: 'public_ip', description: 'Public IP address', terraformExpression: 'aws_lightsail_instance.this.public_ip_address' },
    { name: 'private_ip', description: 'Private IP address', terraformExpression: 'aws_lightsail_instance.this.private_ip_address' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
