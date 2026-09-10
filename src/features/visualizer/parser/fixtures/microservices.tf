# ---------------------------------------------------------------------------------------------------------------------
# REPORT DOWNLOADER
# Async download system: an API service creates jobs (DynamoDB + SQS) and a
# consumer Lambda processes them and updates the job status.
# ---------------------------------------------------------------------------------------------------------------------

data "aws_ecr_repository" "report_downloader_service_repo" {
  provider = aws.shared
  name     = "report-downloader-service"
}

data "aws_acm_certificate" "wildcard_eu" {
  domain   = "*.example.test"
  statuses = ["ISSUED"]
}

resource "aws_dynamodb_table" "report_downloader" {
  name         = "report-downloader-${var.env}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pk"

  attribute {
    name = "pk"
    type = "S"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  tags = merge(local.report_downloader_common_tags, { subproject = "report-downloader-dynamodb" })
}

resource "aws_s3_bucket" "report_downloads" {
  bucket = "report-downloads-${var.env}"
  tags   = merge(local.report_downloader_common_tags, { subproject = "report-downloads" })
}

resource "aws_s3_bucket_lifecycle_configuration" "report_downloads_lifecycle" {
  bucket = aws_s3_bucket.report_downloads.id

  rule {
    id     = "expire-after-24h"
    status = "Enabled"

    expiration {
      days = 1
    }
  }
}

resource "aws_sqs_queue" "report_download_jobs_dlq" {
  name                      = "report-download-jobs-dlq-${var.env}"
  message_retention_seconds = 1209600

  tags = merge(local.report_downloader_common_tags, { subproject = "report-download-jobs-dlq" })
}

resource "aws_sqs_queue" "report_download_jobs" {
  name                       = "report-download-jobs-${var.env}"
  visibility_timeout_seconds = 900

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.report_download_jobs_dlq.arn
    maxReceiveCount     = 3
  })

  tags = merge(local.report_downloader_common_tags, { subproject = "report-download-jobs" })
}

module "report_downloader_service" {
  source = "./../../../../utils/modules/api-gateway-lambda"

  name               = "report-downloader-service"
  app_image          = "${data.aws_ecr_repository.report_downloader_service_repo.repository_url}:0.0.2"
  env                = var.env
  lambda_timeout     = 300
  lambda_memory_size = 512
  dynamodb_table_arn = aws_dynamodb_table.report_downloader.arn

  environments = {
    APP_NAME     = "report-downloader-service"
    JOBS_TABLE   = aws_dynamodb_table.report_downloader.name
    JOBS_QUEUE   = aws_sqs_queue.report_download_jobs.url
    S3_BUCKET    = aws_s3_bucket.report_downloads.bucket
    ASSETS_BASE  = "https://${local.report_downloads_domain_name}"
  }

  custom_domain_name  = "report-downloader-service"
  domain_extension    = "example.test"
  acm_certificate_arn = data.aws_acm_certificate.wildcard_eu.arn

  cognito_user_pool_id = aws_cognito_user_pool.workspace.id

  tags = merge(local.report_downloader_common_tags, { subproject = "report-downloader-service" })
}
