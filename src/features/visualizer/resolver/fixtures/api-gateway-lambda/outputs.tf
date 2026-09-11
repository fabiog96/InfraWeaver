output "api_gateway_url" {
  value = aws_apigatewayv2_stage.this.invoke_url
}

output "api_gateway_domain_name" {
  value = aws_apigatewayv2_domain_name.this.domain_name
}

output "lambda_function_arn" {
  value = aws_lambda_function.this.arn
}
