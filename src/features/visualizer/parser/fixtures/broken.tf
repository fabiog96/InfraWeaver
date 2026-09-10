resource "aws_s3_bucket" "report_downloads" {
  bucket = "report-downloads-${var.env}"
  tags = {
    terraform = true
