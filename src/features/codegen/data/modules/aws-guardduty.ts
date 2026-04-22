import type { TerraformModule } from '../../types';

export const awsGuarddutyModule: TerraformModule = {
  id: 'aws-guardduty',
  category: 'security',
  resourceBlocks: [
    {
      resourceType: 'aws_guardduty_detector',
      resourceName: 'this',
      attributes: [
        { attribute: 'enable', fromInput: 'enable' },
        { attribute: 'finding_publishing_frequency', fromInput: 'finding_publishing_frequency' },
      ],
    },
  ],
  inputs: [
    { name: 'enable', type: 'bool', default: true, required: false, description: 'Enable GuardDuty detector' },
    { name: 'finding_publishing_frequency', type: 'string', default: 'SIX_HOURS', required: false, description: 'Finding publish frequency', options: ['FIFTEEN_MINUTES', 'ONE_HOUR', 'SIX_HOURS'] },
  ],
  outputs: [
    { name: 'detector_id', description: 'Detector ID', terraformExpression: 'aws_guardduty_detector.this.id' },
    { name: 'account_id', description: 'AWS account ID', terraformExpression: 'aws_guardduty_detector.this.account_id' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
