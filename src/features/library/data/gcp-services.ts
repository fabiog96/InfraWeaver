import type { ServiceDefinition } from '@/shared/types';

export const gcpServices: ServiceDefinition[] = [
  { id: 'gcp-compute', label: 'Compute Engine', provider: 'gcp', serviceType: 'VM Instance', icon: 'gcp-compute', category: 'compute', defaultColor: '#4285F4' },
  { id: 'gcp-functions', label: 'Cloud Functions', provider: 'gcp', serviceType: 'Cloud Function', icon: 'gcp-functions', category: 'compute', defaultColor: '#4285F4' },
  { id: 'gcp-app-engine', label: 'App Engine', provider: 'gcp', serviceType: 'App Engine', icon: 'gcp-app-engine', category: 'compute', defaultColor: '#4285F4' },
  { id: 'gcp-cloud-run', label: 'Cloud Run', provider: 'gcp', serviceType: 'Cloud Run Service', icon: 'gcp-cloud-run', category: 'containers', defaultColor: '#4285F4' },
  { id: 'gcp-gke', label: 'GKE', provider: 'gcp', serviceType: 'Kubernetes Cluster', icon: 'gcp-gke', category: 'containers', defaultColor: '#4285F4' },
  { id: 'gcp-storage', label: 'Cloud Storage', provider: 'gcp', serviceType: 'Storage Bucket', icon: 'gcp-storage', category: 'storage', defaultColor: '#4285F4' },
  { id: 'gcp-sql', label: 'Cloud SQL', provider: 'gcp', serviceType: 'SQL Instance', icon: 'gcp-sql', category: 'database', defaultColor: '#4285F4' },
  { id: 'gcp-firestore', label: 'Firestore', provider: 'gcp', serviceType: 'Firestore DB', icon: 'gcp-firestore', category: 'database', defaultColor: '#4285F4' },
  { id: 'gcp-cdn', label: 'Cloud CDN', provider: 'gcp', serviceType: 'CDN', icon: 'gcp-cdn', category: 'networking', defaultColor: '#4285F4' },
  { id: 'gcp-lb', label: 'Load Balancing', provider: 'gcp', serviceType: 'Load Balancer', icon: 'gcp-lb', category: 'networking', defaultColor: '#4285F4' },
  { id: 'gcp-pubsub', label: 'Pub/Sub', provider: 'gcp', serviceType: 'Pub/Sub Topic', icon: 'gcp-pubsub', category: 'messaging', defaultColor: '#4285F4' },
  { id: 'gcp-bigquery', label: 'BigQuery', provider: 'gcp', serviceType: 'BigQuery Dataset', icon: 'gcp-bigquery', category: 'analytics', defaultColor: '#4285F4' },
];
