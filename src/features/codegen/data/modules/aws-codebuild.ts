import type { TerraformModule } from '../../types';

export const awsCodebuildModule: TerraformModule = {
  id: 'aws-codebuild',
  category: 'devtools',
  resourceBlocks: [
    {
      resourceType: 'aws_codebuild_project',
      resourceName: 'this',
      attributes: [
        { attribute: 'name', fromInput: 'project_name' },
        { attribute: 'description', fromInput: 'description' },
        { attribute: 'build_timeout', fromInput: 'build_timeout' },
        { attribute: 'service_role', fromInput: 'service_role_arn' },
      ],
      nestedBlocks: [
        {
          blockType: 'environment',
          attributes: [
            { attribute: 'compute_type', fromInput: 'compute_type' },
            { attribute: 'image', fromInput: 'build_image' },
            { attribute: 'type', fromInput: 'environment_type' },
            { attribute: 'privileged_mode', fromInput: 'privileged_mode' },
          ],
        },
        {
          blockType: 'source',
          attributes: [
            { attribute: 'type', fromInput: 'source_type' },
            { attribute: 'location', fromInput: 'source_location' },
          ],
        },
        {
          blockType: 'artifacts',
          attributes: [
            { attribute: 'type', fromInput: 'artifact_type' },
          ],
        },
      ],
    },
  ],
  inputs: [
    { name: 'project_name', type: 'string', required: true, description: 'CodeBuild project name' },
    { name: 'description', type: 'string', required: false, description: 'Project description' },
    { name: 'build_timeout', type: 'number', default: 60, required: false, description: 'Build timeout in minutes' },
    { name: 'service_role_arn', type: 'string', required: true, description: 'IAM service role ARN' },
    { name: 'compute_type', type: 'string', default: 'BUILD_GENERAL1_SMALL', required: false, description: 'Compute type', options: ['BUILD_GENERAL1_SMALL', 'BUILD_GENERAL1_MEDIUM', 'BUILD_GENERAL1_LARGE', 'BUILD_GENERAL1_2XLARGE', 'BUILD_LAMBDA_1GB', 'BUILD_LAMBDA_2GB', 'BUILD_LAMBDA_4GB', 'BUILD_LAMBDA_8GB', 'BUILD_LAMBDA_10GB'] },
    { name: 'build_image', type: 'string', default: 'aws/codebuild/amazonlinux2-x86_64-standard:5.0', required: false, description: 'Build image' },
    { name: 'environment_type', type: 'string', default: 'LINUX_CONTAINER', required: false, description: 'Environment type', options: ['LINUX_CONTAINER', 'LINUX_GPU_CONTAINER', 'ARM_CONTAINER', 'LINUX_LAMBDA_CONTAINER'] },
    { name: 'privileged_mode', type: 'bool', default: false, required: false, description: 'Enable privileged mode (for Docker builds)' },
    { name: 'source_type', type: 'string', default: 'CODECOMMIT', required: false, description: 'Source type', options: ['CODECOMMIT', 'CODEPIPELINE', 'GITHUB', 'BITBUCKET', 'S3', 'NO_SOURCE'] },
    { name: 'source_location', type: 'string', required: false, description: 'Source location URL' },
    { name: 'artifact_type', type: 'string', default: 'NO_ARTIFACTS', required: false, description: 'Artifact type', options: ['CODEPIPELINE', 'NO_ARTIFACTS', 'S3'] },
  ],
  outputs: [
    { name: 'project_arn', description: 'Project ARN', terraformExpression: 'aws_codebuild_project.this.arn' },
    { name: 'project_id', description: 'Project ID', terraformExpression: 'aws_codebuild_project.this.id' },
  ],
  secrets: [],
  requiredProviders: ['aws'],
  implicitDependencies: ['aws-iam'],
};
