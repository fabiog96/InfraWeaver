import type { PackagedModule } from '../types';

export const etlPipelineModule: PackagedModule = {
  id: 'etl-pipeline',
  name: 'ETL Pipeline',
  description: 'S3 source triggering a Lambda ETL processor with S3 output',
  icon: 'aws-lambda',
  category: 'data',
  group: { label: 'ETL Pipeline', folderName: 'datasource-etl' },
  nodes: [
    {
      relativeId: 's3-source',
      serviceId: 'aws-s3',
      label: 'Source Bucket',
      position: { x: 0, y: 0 },
      terraformInputs: { bucket_name: 'etl-source' },
    },
    {
      relativeId: 'lambda',
      serviceId: 'aws-lambda',
      label: 'ETL Processor',
      position: { x: 0, y: 180 },
      terraformInputs: { runtime: 'python3.12', handler: 'main.lambda_handler', memory_size: 512, timeout: 300 },
    },
    {
      relativeId: 's3-output',
      serviceId: 'aws-s3',
      label: 'Output Bucket',
      position: { x: 0, y: 360 },
      terraformInputs: { bucket_name: 'etl-output' },
    },
    {
      relativeId: 'iam',
      serviceId: 'aws-iam',
      label: 'ETL Role',
      position: { x: 250, y: 180 },
      terraformInputs: { role_name: 'etl-lambda-role' },
    },
  ],
  edges: [
    { sourceRelativeId: 's3-source', targetRelativeId: 'lambda', label: 'trigger' },
    { sourceRelativeId: 'lambda', targetRelativeId: 's3-output', label: 'write' },
    { sourceRelativeId: 'iam', targetRelativeId: 'lambda', label: 'assume role' },
  ],
};
