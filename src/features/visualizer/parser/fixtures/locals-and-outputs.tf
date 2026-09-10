locals {
  report_downloader_name = "report-downloader-service"

  report_downloader_common_tags = {
    terraform   = true
    environment = var.env
    project     = "report-downloader"
  }

  report_downloads_domain_name = "reports.${var.env}.example.test"

  cognito_domain = "${aws_cognito_user_pool_domain.workspace_pool_domain.domain}.auth.eu-west-1.amazoncognito.com"

  config_json_content = jsonencode({
    "cognito" = {
      "domain"           = local.cognito_domain,
      "userPoolClientId" = aws_cognito_user_pool_client.web_client.id,
      "userPoolId"       = aws_cognito_user_pool.workspace.id,
    },
    "cloudEnv" = var.env,
  })
}

variable "env" {
  description = "Deployment environment name"
  type        = string
}

variable "report_downloader_topic_arn" {
  description = "ARN of the report downloader SNS topic"
  type        = string
  default     = null
}

output "report_downloader_table_arn" {
  value       = aws_dynamodb_table.report_downloader.arn
  description = "The ARN of the report downloader job table"
}

output "workspace_cognito_user_pool_id" {
  value       = aws_cognito_user_pool.workspace.id
  description = "The ID of the workspace Cognito User Pool"
}
