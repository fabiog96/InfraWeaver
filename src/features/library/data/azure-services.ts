import type { ServiceDefinition } from '@/shared/types';

export const azureServices: ServiceDefinition[] = [
  { id: 'azure-vm', label: 'Virtual Machines', provider: 'azure', serviceType: 'VM Instance', icon: 'azure-vm', category: 'compute', defaultColor: '#0078D4' },
  { id: 'azure-functions', label: 'Functions', provider: 'azure', serviceType: 'Azure Function', icon: 'azure-functions', category: 'compute', defaultColor: '#0078D4' },
  { id: 'azure-app-service', label: 'App Service', provider: 'azure', serviceType: 'Web App', icon: 'azure-app-service', category: 'compute', defaultColor: '#0078D4' },
  { id: 'azure-aks', label: 'AKS', provider: 'azure', serviceType: 'Kubernetes Service', icon: 'azure-aks', category: 'containers', defaultColor: '#0078D4' },
  { id: 'azure-blob', label: 'Blob Storage', provider: 'azure', serviceType: 'Blob Container', icon: 'azure-blob', category: 'storage', defaultColor: '#0078D4' },
  { id: 'azure-sql', label: 'SQL Database', provider: 'azure', serviceType: 'SQL Database', icon: 'azure-sql', category: 'database', defaultColor: '#0078D4' },
  { id: 'azure-cosmos', label: 'Cosmos DB', provider: 'azure', serviceType: 'Cosmos DB Account', icon: 'azure-cosmos', category: 'database', defaultColor: '#0078D4' },
  { id: 'azure-cdn', label: 'CDN', provider: 'azure', serviceType: 'CDN Profile', icon: 'azure-cdn', category: 'networking', defaultColor: '#0078D4' },
  { id: 'azure-apim', label: 'API Management', provider: 'azure', serviceType: 'API Gateway', icon: 'azure-apim', category: 'networking', defaultColor: '#0078D4' },
  { id: 'azure-lb', label: 'Load Balancer', provider: 'azure', serviceType: 'Load Balancer', icon: 'azure-lb', category: 'networking', defaultColor: '#0078D4' },
  { id: 'azure-key-vault', label: 'Key Vault', provider: 'azure', serviceType: 'Key Vault', icon: 'azure-key-vault', category: 'security', defaultColor: '#0078D4' },
  { id: 'azure-event-hub', label: 'Event Hub', provider: 'azure', serviceType: 'Event Hub', icon: 'azure-event-hub', category: 'messaging', defaultColor: '#0078D4' },
];
