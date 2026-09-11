module "checkout_service" {
  source = "./../../../../utils/modules/api-gateway-lambda"

  name           = "checkout-service"
  app_image      = "checkout-service:0.0.1"
  env            = var.env
  lambda_timeout = 120
}

module "ledger_service" {
  source = "hashicorp/consul/aws"

  name = "ledger-service"
}
