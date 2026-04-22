import type { ServiceDefinition } from '@/shared/types';

const generic = (id: string, label: string, category: string, color = '#3b82f6'): ServiceDefinition => ({
  id: `generic-${id}`, label, provider: 'generic', serviceType: label, icon: `generic-${id}`, category, defaultColor: color,
});

export const genericServices: ServiceDefinition[] = [
  generic('server', 'Server', 'compute'),
  generic('database', 'Database', 'database'),
  generic('network', 'Network', 'networking'),
  generic('storage', 'Storage', 'storage'),
  generic('compute', 'Compute', 'compute'),
  generic('computer', 'Computer', 'compute'),
  generic('users', 'Users', 'actors'),
  generic('react', 'React', 'other'),
  generic('json', 'JSON', 'other'),
  generic('mobile-app', 'Mobile App', 'clients'),
  generic('web-app', 'Web App', 'clients'),
  generic('iot-device', 'IoT Device', 'clients'),
  generic('external-api', 'External API', 'clients'),
  generic('developer', 'Developer', 'actors'),
  generic('admin', 'Admin', 'actors'),
  generic('internet', 'Internet', 'other'),
  generic('cloud', 'Cloud', 'other'),
  generic('text', 'Text', 'other'),
  generic('note', 'Note', 'other', '#facc15'),
];
