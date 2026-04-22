import type { TerraformModule } from '../../types';

export const awsEbsModule: TerraformModule = {
  id: 'aws-ebs',
  category: 'storage',
  resourceBlocks: [
    {
      resourceType: 'aws_ebs_volume',
      resourceName: 'this',
      attributes: [
        { attribute: 'availability_zone', fromInput: 'availability_zone' },
        { attribute: 'size', fromInput: 'size' },
        { attribute: 'type', fromInput: 'volume_type' },
        { attribute: 'iops', fromInput: 'iops' },
        { attribute: 'encrypted', fromInput: 'encrypted' },
      ],
    },
  ],
  inputs: [
    { name: 'availability_zone', type: 'string', required: true, description: 'Availability zone' },
    { name: 'size', type: 'number', default: 20, required: false, description: 'Volume size in GiB' },
    { name: 'volume_type', type: 'string', default: 'gp3', required: false, description: 'Volume type', options: ['gp3', 'gp2', 'io1', 'io2', 'st1', 'sc1', 'standard'] },
    { name: 'iops', type: 'number', default: 3000, required: false, description: 'Provisioned IOPS (for gp3/io1/io2)' },
    { name: 'encrypted', type: 'bool', default: true, required: false, description: 'Enable encryption' },
  ],
  outputs: [
    { name: 'volume_id', description: 'Volume ID', terraformExpression: 'aws_ebs_volume.this.id' },
    { name: 'volume_arn', description: 'Volume ARN', terraformExpression: 'aws_ebs_volume.this.arn' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
