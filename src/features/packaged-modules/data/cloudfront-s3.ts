import type { PackagedModule } from '../types';

export const cloudfrontS3Module: PackagedModule = {
  id: 'cloudfront-s3',
  name: 'CloudFront + S3',
  description: 'S3 static website with CloudFront CDN distribution',
  icon: 'aws-cloudfront',
  category: 'frontend',
  group: { label: 'Static Website', folderName: 'static-website' },
  nodes: [
    {
      relativeId: 'cloudfront',
      serviceId: 'aws-cloudfront',
      label: 'CDN',
      position: { x: 0, y: 0 },
      terraformInputs: {
        enabled: true,
        default_root_object: 'index.html',
        price_class: 'PriceClass_100',
      },
    },
    {
      relativeId: 's3',
      serviceId: 'aws-s3',
      label: 'Static Assets',
      position: { x: 0, y: 180 },
      terraformInputs: {
        bucket_name: 'my-static-website',
        versioning: 'Enabled',
      },
    },
  ],
  edges: [
    { sourceRelativeId: 'cloudfront', targetRelativeId: 's3', label: 'origin' },
  ],
};
