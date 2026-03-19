import type { GlobalConfig } from '../types';

export type { GlobalConfig };

export const renderRootTerragruntHcl = (config: GlobalConfig): string => {
  return `locals {
  region      = "${config.region}"
  environment = "${config.environment}"
  project     = "${config.project}"
  subproject  = "${config.subproject}"
}

remote_state {
  backend = "s3"
  generate = {
    path      = "backend.tf"
    if_exists = "overwrite"
  }
  config = {
    bucket         = "${config.stateBucket}"
    key            = "\${path_relative_to_include()}/terraform.tfstate"
    region         = local.region
    encrypt        = true
    dynamodb_table = "${config.lockTable}"
  }
}

generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite"
  contents  = <<EOF
provider "aws" {
  region = "\${local.region}"
  default_tags {
    tags = {
      terraform   = "true"
      environment = "\${local.environment}"
      project     = "\${local.project}"
      subproject  = "\${local.subproject}"
    }
  }
}
EOF
}
`;
};

export const renderCommonHcl = (): string => {
  return `locals {
  common_vars = read_terragrunt_config(find_in_parent_folders("terragrunt.hcl"))
  region      = local.common_vars.locals.region
  environment = local.common_vars.locals.environment
  project     = local.common_vars.locals.project
  subproject  = local.common_vars.locals.subproject
}
`;
};
