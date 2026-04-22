import type { TerraformModule } from '../../types';

export const awsAcmModule: TerraformModule = {
  id: 'aws-acm',
  category: 'security',
  resourceBlocks: [
    {
      resourceType: 'aws_acm_certificate',
      resourceName: 'this',
      attributes: [
        { attribute: 'domain_name', fromInput: 'domain_name' },
        { attribute: 'validation_method', fromInput: 'validation_method' },
      ],
    },
  ],
  inputs: [
    { name: 'domain_name', type: 'string', required: true, description: 'Domain name for the certificate' },
    { name: 'validation_method', type: 'string', default: 'DNS', required: false, description: 'Validation method', options: ['DNS', 'EMAIL'] },
  ],
  outputs: [
    { name: 'certificate_arn', description: 'Certificate ARN', terraformExpression: 'aws_acm_certificate.this.arn' },
    { name: 'domain_name', description: 'Domain name', terraformExpression: 'aws_acm_certificate.this.domain_name' },
    { name: 'domain_validation_options', description: 'Validation options', terraformExpression: 'aws_acm_certificate.this.domain_validation_options' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
