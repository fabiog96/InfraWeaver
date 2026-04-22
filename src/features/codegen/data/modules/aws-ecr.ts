import type { TerraformModule } from '../../types';

export const awsEcrModule: TerraformModule = {
  id: 'aws-ecr',
  category: 'containers',
  resourceBlocks: [
    {
      resourceType: 'aws_ecr_repository',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'repository_name' },
        { attribute: 'image_tag_mutability', fromInput: 'image_tag_mutability' },
        { attribute: 'force_delete', fromInput: 'force_delete' },
      ],
      nestedBlocks: [
        {
          blockType: 'image_scanning_configuration',
          attributes: [
            { attribute: 'scan_on_push', fromInput: 'scan_on_push' },
          ],
        },
      ],
    },
  ],
  inputs: [
    { name: 'repository_name', type: 'string', required: true, description: 'ECR repository name' },
    { name: 'image_tag_mutability', type: 'string', default: 'IMMUTABLE', required: false, description: 'Tag mutability setting', options: ['MUTABLE', 'IMMUTABLE'] },
    { name: 'scan_on_push', type: 'bool', default: true, required: false, description: 'Enable image scan on push' },
    { name: 'force_delete', type: 'bool', default: false, required: false, description: 'Force delete repository with images' },
  ],
  outputs: [
    { name: 'repository_url', description: 'Repository URL', terraformExpression: 'aws_ecr_repository.this.repository_url' },
    { name: 'repository_arn', description: 'Repository ARN', terraformExpression: 'aws_ecr_repository.this.arn' },
    { name: 'registry_id', description: 'Registry ID', terraformExpression: 'aws_ecr_repository.this.registry_id' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
};
