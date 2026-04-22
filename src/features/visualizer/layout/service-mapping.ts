/**
 * Maps a Terraform resource type to its icon key and color for the canvas node.
 *
 * @example
 * RESOURCE_MAPPING['aws_lambda_function']
 * // → { icon: 'aws-lambda', color: '#FF9900' }
 *
 * RESOURCE_MAPPING['aws_dynamodb_table']
 * // → { icon: 'aws-dynamodb', color: '#4053D6' }
 */
export const RESOURCE_MAPPING: Record<string, { icon: string; color: string }> = {
  aws_lambda_function: { icon: 'aws-lambda', color: '#FF9900' },
  aws_dynamodb_table: { icon: 'aws-dynamodb', color: '#4053D6' },
  aws_apigatewayv2_api: { icon: 'aws-api-gateway', color: '#FF4F8B' },
  aws_api_gateway_rest_api: { icon: 'aws-api-gateway', color: '#FF4F8B' },
  aws_cognito_user_pool: { icon: 'aws-cognito', color: '#DD344C' },
  aws_cognito_user_pool_client: { icon: 'aws-cognito', color: '#DD344C' },
  aws_cognito_identity_provider: { icon: 'aws-cognito', color: '#DD344C' },
  aws_cognito_user_pool_domain: { icon: 'aws-cognito', color: '#DD344C' },
  aws_s3_bucket: { icon: 'aws-s3', color: '#3F8624' },
  aws_cloudfront_distribution: { icon: 'aws-cloudfront', color: '#8C4FFF' },
  aws_route53_record: { icon: 'aws-route53', color: '#8C4FFF' },
  aws_route53_zone: { icon: 'aws-route53', color: '#8C4FFF' },
  aws_ecs_service: { icon: 'aws-ecs', color: '#FF9900' },
  aws_ecs_task_definition: { icon: 'aws-ecs', color: '#FF9900' },
  aws_ecs_cluster: { icon: 'aws-ecs', color: '#FF9900' },
  aws_eks_cluster: { icon: 'aws-eks', color: '#FF9900' },
  aws_lb: { icon: 'aws-elb', color: '#8C4FFF' },
  aws_lb_target_group: { icon: 'aws-elb', color: '#8C4FFF' },
  aws_lb_listener: { icon: 'aws-elb', color: '#8C4FFF' },
  aws_sqs_queue: { icon: 'aws-sqs', color: '#FF4F8B' },
  aws_sns_topic: { icon: 'aws-sns', color: '#FF4F8B' },
  aws_sns_topic_subscription: { icon: 'aws-sns', color: '#FF4F8B' },
  aws_vpc: { icon: 'aws-vpc', color: '#248814' },
  aws_subnet: { icon: 'aws-vpc', color: '#248814' },
  aws_security_group: { icon: 'aws-vpc', color: '#248814' },
  aws_iam_role: { icon: 'aws-iam', color: '#DD344C' },
  aws_iam_policy: { icon: 'aws-iam', color: '#DD344C' },
  aws_iam_role_policy_attachment: { icon: 'aws-iam', color: '#DD344C' },
  aws_acm_certificate: { icon: 'aws-acm', color: '#DD344C' },
  aws_secretsmanager_secret: { icon: 'aws-secrets-manager', color: '#DD344C' },
  aws_secretsmanager_secret_version: { icon: 'aws-secrets-manager', color: '#DD344C' },
  aws_kinesis_stream: { icon: 'aws-kinesis', color: '#8C4FFF' },
  aws_elasticache_cluster: { icon: 'aws-elasticache', color: '#4053D6' },
  aws_rds_cluster: { icon: 'aws-rds', color: '#4053D6' },
  aws_db_instance: { icon: 'aws-rds', color: '#4053D6' },
  aws_sagemaker_notebook_instance: { icon: 'aws-sagemaker', color: '#56A13A' },
  aws_cloudwatch_event_rule: { icon: 'aws-eventbridge', color: '#FF9900' },
  aws_cloudwatch_log_group: { icon: 'aws-cloudwatch', color: '#FF9900' },
  aws_glue_catalog_database: { icon: 'aws-glue', color: '#8C4FFF' },
  aws_glue_catalog_table: { icon: 'aws-glue', color: '#8C4FFF' },
  aws_glue_crawler: { icon: 'aws-glue', color: '#8C4FFF' },
  aws_glue_job: { icon: 'aws-glue', color: '#8C4FFF' },
  aws_athena_workgroup: { icon: 'aws-athena', color: '#8C4FFF' },
  aws_sfn_state_machine: { icon: 'aws-step-functions', color: '#FF4F8B' },
  aws_ecr_repository: { icon: 'aws-ecr', color: '#FF9900' },
};

/**
 * Maps a normalized module source name to composite icons and a label (D8).
 * Modules that wrap multiple AWS services show all relevant icons side by side.
 *
 * @example
 * MODULE_MAPPING['api-gateway-lambda']
 * // → { icons: ['aws-api-gateway', 'aws-lambda'], color: '#FF9900', label: 'API GW + Lambda' }
 *
 * MODULE_MAPPING['cloudfront-s3-static']
 * // → { icons: ['aws-cloudfront', 'aws-s3'], color: '#8C4FFF', label: 'CloudFront + S3' }
 */
export const MODULE_MAPPING: Record<string, { icons: string[]; color: string; label: string }> = {
  'api-gateway-lambda': {
    icons: ['aws-api-gateway', 'aws-lambda'],
    color: '#FF9900',
    label: 'API GW + Lambda',
  },
  'cloudfront-s3-static': {
    icons: ['aws-cloudfront', 'aws-s3'],
    color: '#8C4FFF',
    label: 'CloudFront + S3',
  },
  'api-gateway-to-sqs': {
    icons: ['aws-api-gateway', 'aws-sqs'],
    color: '#FF4F8B',
    label: 'API GW + SQS',
  },
  'ecs-microservice-api': {
    icons: ['aws-ecs', 'aws-elb'],
    color: '#FF9900',
    label: 'ECS + ALB',
  },
  'scheduled-lambda': {
    icons: ['aws-lambda'],
    color: '#FF9900',
    label: 'Scheduled Lambda',
  },
  'sns-consumer-lambda': {
    icons: ['aws-sns', 'aws-lambda'],
    color: '#FF4F8B',
    label: 'SNS + Lambda',
  },
  'lambda-api': {
    icons: ['aws-api-gateway', 'aws-lambda'],
    color: '#FF9900',
    label: 'Lambda API',
  },
  'datasource-etl': {
    icons: ['aws-lambda', 'aws-s3'],
    color: '#8C4FFF',
    label: 'ETL Pipeline',
  },
  'stp-etl': {
    icons: ['aws-lambda', 'generic-database'],
    color: '#8C4FFF',
    label: 'STP ETL',
  },
};

/** Default style for unrecognized resources. */
const DEFAULT_RESOURCE = { icon: 'generic-server', color: '#666666' };

/** Default style for unrecognized modules. */
const DEFAULT_MODULE = { icons: ['generic-compute'], color: '#666666', label: 'Module' };

/**
 * Known service keywords mapped to their icon key.
 * Used as a fallback when a module source is not in MODULE_MAPPING
 * but contains a recognizable keyword in its path.
 *
 * @example
 * // Module source "custom-lambda-processor" → matches keyword "lambda" → icon 'aws-lambda'
 */
const KEYWORD_ICON_MAP: Record<string, string> = {
  lambda: 'aws-lambda',
  gateway: 'aws-api-gateway',
  s3: 'aws-s3',
  cloudfront: 'aws-cloudfront',
  dynamodb: 'aws-dynamodb',
  ecs: 'aws-ecs',
  eks: 'aws-eks',
  sqs: 'aws-sqs',
  sns: 'aws-sns',
  cognito: 'aws-cognito',
  rds: 'aws-rds',
  vpc: 'aws-vpc',
  iam: 'aws-iam',
  route53: 'aws-route53',
  elb: 'aws-elb',
  glue: 'aws-glue',
  athena: 'aws-athena',
  stepfunction: 'aws-step-functions',
};

/**
 * Resolves the icon and color for a Terraform resource type.
 * Falls back to a generic icon if the type is not in the mapping.
 */
export const getResourceStyle = (resourceType: string): { icon: string; color: string } => {
  return RESOURCE_MAPPING[resourceType] ?? DEFAULT_RESOURCE;
};

/**
 * Resolves the icons, color, and label for a module by its normalized source path.
 * First checks the explicit MODULE_MAPPING, then falls back to keyword extraction
 * from the source name. Returns a generic module icon if nothing matches.
 *
 * @example
 * getModuleStyle('api-gateway-lambda')
 * // → { icons: ['aws-api-gateway', 'aws-lambda'], color: '#FF9900', label: 'API GW + Lambda' }
 *
 * getModuleStyle('custom-lambda-processor')
 * // → { icons: ['aws-lambda'], color: '#FF9900', label: 'custom-lambda-processor' }  (keyword fallback)
 *
 * getModuleStyle('unknown-module')
 * // → { icons: ['generic-compute'], color: '#666666', label: 'Module' }
 */
export const getModuleStyle = (
  normalizedSource: string,
): { icons: string[]; color: string; label: string } => {
  const explicit = MODULE_MAPPING[normalizedSource];
  if (explicit) return explicit;

  const matchedIcons: string[] = [];
  let matchedColor = DEFAULT_MODULE.color;

  for (const [keyword, icon] of Object.entries(KEYWORD_ICON_MAP)) {
    if (normalizedSource.includes(keyword)) {
      matchedIcons.push(icon);
      const mapped = Object.values(RESOURCE_MAPPING).find((r) => r.icon === icon);
      if (mapped) matchedColor = mapped.color;
    }
  }

  if (matchedIcons.length > 0) {
    return {
      icons: [...new Set(matchedIcons)],
      color: matchedColor,
      label: normalizedSource,
    };
  }

  return { ...DEFAULT_MODULE, label: normalizedSource };
};
