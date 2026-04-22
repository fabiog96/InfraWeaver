import type { TerraformModule } from '../../types';

export const awsGlobalAcceleratorModule: TerraformModule = {
  id: 'aws-global-accelerator',
  category: 'networking',
  resourceBlocks: [
    {
      resourceType: 'aws_globalaccelerator_accelerator',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'accelerator_name' },
        { attribute: 'ip_address_type', fromInput: 'ip_address_type' },
        { attribute: 'enabled', fromInput: 'enabled' },
      ],
    },
  ],
  inputs: [
    { name: 'accelerator_name', type: 'string', required: true, description: 'Global Accelerator name' },
    { name: 'ip_address_type', type: 'string', default: 'IPV4', required: false, description: 'IP address type', options: ['IPV4', 'DUAL_STACK'] },
    { name: 'enabled', type: 'bool', default: true, required: false, description: 'Enable the accelerator' },
  ],
  outputs: [
    { name: 'accelerator_id', description: 'Accelerator ID', terraformExpression: 'aws_globalaccelerator_accelerator.this.id' },
    { name: 'dns_name', description: 'DNS name', terraformExpression: 'aws_globalaccelerator_accelerator.this.dns_name' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
