# ---------------------------------------------------------------------------------------------------------------------
# EDGE CASES
# A stack written to push the graph boundaries: a dangling reference, a circular
# pair, a self-reference, a block wired to nothing, and the same target read twice.
# ---------------------------------------------------------------------------------------------------------------------

resource "aws_lambda_function" "notifier" {
  function_name = "notifier-${var.env}"
  role          = aws_iam_role.notifier.arn

  environment {
    variables = {
      ALERTS_TOPIC = aws_sns_topic.alerts.arn
    }
  }

  tags = merge(local.notifier_common_tags, { subproject = "notifier" })
}

resource "aws_security_group" "api" {
  name        = "api-${var.env}"
  description = "Ingress for the API tier"

  egress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [aws_security_group.worker.id]
  }
}

resource "aws_security_group" "worker" {
  name        = "worker-${var.env}"
  description = "Ingress for the worker tier"

  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.api.id]
  }
}

resource "aws_s3_bucket" "artifacts" {
  bucket = "artifacts-${var.env}"
  tags   = merge(local.notifier_common_tags, { subproject = "artifacts" })
}

resource "aws_s3_bucket_policy" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Action    = ["s3:GetObject"]
        Resource  = "${aws_s3_bucket.artifacts.arn}/*"
      },
    ]
  })
}

resource "aws_cloudwatch_log_group" "standalone" {
  name              = "/aws/standalone"
  retention_in_days = 14
}

resource "aws_iam_role" "notifier" {
  name = "notifier-${var.env}"

  inline_policy {
    name   = "self-describe"
    policy = aws_iam_role.notifier.arn
  }
}
