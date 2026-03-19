import type { GlobalConfig } from './root-renderer';

export const renderGitlabCiYml = (config: GlobalConfig): string => {
  return `stages:
  - validate
  - plan
  - apply

variables:
  AWS_DEFAULT_REGION: ${config.region}
  TF_VERSION: "1.9.0"
  TG_VERSION: "0.67.0"

.terragrunt-base:
  image: alpine:latest
  before_script:
    - apk add --no-cache curl unzip
    - curl -sL "https://releases.hashicorp.com/terraform/\${TF_VERSION}/terraform_\${TF_VERSION}_linux_amd64.zip" -o terraform.zip
    - unzip terraform.zip && mv terraform /usr/local/bin/ && rm terraform.zip
    - curl -sL "https://github.com/gruntwork-io/terragrunt/releases/download/v\${TG_VERSION}/terragrunt_linux_amd64" -o /usr/local/bin/terragrunt
    - chmod +x /usr/local/bin/terragrunt

validate:
  extends: .terragrunt-base
  stage: validate
  script:
    - cd infrastructure-live && terragrunt run-all validate --terragrunt-non-interactive

plan:
  extends: .terragrunt-base
  stage: plan
  script:
    - cd infrastructure-live && terragrunt run-all plan --terragrunt-non-interactive
  only:
    - merge_requests

apply:
  extends: .terragrunt-base
  stage: apply
  script:
    - cd infrastructure-live && terragrunt run-all apply --terragrunt-non-interactive
  only:
    - main
  when: manual
`;
};
