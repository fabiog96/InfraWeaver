variable "name" {
  type        = string
  description = "Logical name of the service"
}

variable "app_image" {
  type        = string
  description = "Container image the Lambda runs"
}

variable "env" {
  type = string
}

variable "lambda_timeout" {
  type    = number
  default = 30
}

variable "environments" {
  type    = map(string)
  default = {}
}
