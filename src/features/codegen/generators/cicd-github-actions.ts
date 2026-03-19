import type { GlobalConfig } from './root-renderer';

export const renderGithubActionsYml = (config: GlobalConfig): string => {
  return `name: Terragrunt Deploy
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  AWS_REGION: ${config.region}
  TF_VERSION: "1.9.0"
  TG_VERSION: "0.67.0"

permissions:
  id-token: write
  contents: read

jobs:
  plan:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: \${{ env.TF_VERSION }}
      - name: Install Terragrunt
        run: |
          curl -sL "https://github.com/gruntwork-io/terragrunt/releases/download/v\${TG_VERSION}/terragrunt_linux_amd64" -o terragrunt
          chmod +x terragrunt && sudo mv terragrunt /usr/local/bin/
      - name: Terragrunt Plan
        run: terragrunt run-all plan --terragrunt-non-interactive
        working-directory: infrastructure-live

  apply:
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: \${{ env.TF_VERSION }}
      - name: Install Terragrunt
        run: |
          curl -sL "https://github.com/gruntwork-io/terragrunt/releases/download/v\${TG_VERSION}/terragrunt_linux_amd64" -o terragrunt
          chmod +x terragrunt && sudo mv terragrunt /usr/local/bin/
      - name: Terragrunt Apply
        run: terragrunt run-all apply --terragrunt-non-interactive
        working-directory: infrastructure-live
`;
};
