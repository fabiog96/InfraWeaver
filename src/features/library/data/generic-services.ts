import type { ServiceDefinition } from '@/shared/types';

export const genericServices: ServiceDefinition[] = [
    { id: 'generic-server', label: 'Server', provider: 'generic', serviceType: 'Server', icon: 'generic-server', category: 'compute', defaultColor: '#42f49eff' },
    { id: 'generic-database', label: 'Database', provider: 'generic', serviceType: 'Database', icon: 'generic-database', category: 'database', defaultColor: '#42f49eff' },
    { id: 'generic-network ', label: 'Network', provider: 'generic', serviceType: 'Network', icon: 'generic-network', category: 'networking', defaultColor: '#42f49eff' },
    { id: 'generic-storage', label: 'Storage', provider: 'generic', serviceType: 'Storage', icon: 'generic-storage', category: 'storage', defaultColor: '#42f49eff' },
    { id: 'generic-compute', label: 'Compute', provider: 'generic', serviceType: 'Compute', icon: 'generic-compute', category: 'compute', defaultColor: '#42f49eff' },
    { id: 'generic-computer', label: 'Computer', provider: 'generic', serviceType: 'Computer', icon: 'generic-computer', category: 'computer', defaultColor: '#42f49eff' },
    { id: 'generic-users', label: 'Users', provider: 'generic', serviceType: 'Users', icon: 'generic-users', category: 'users', defaultColor: '#42f49eff' },
    { id: 'generic-react', label: 'React', provider: 'generic', serviceType: 'React', icon: 'generic-react', category: 'react', defaultColor: '#42f49eff' },
    { id: 'generic-json', label: 'JSON', provider: 'generic', serviceType: 'JSON', icon: 'generic-json', category: 'json', defaultColor: '#42f49eff' },
    { id: 'generic-note', label: 'Note', provider: 'generic', serviceType: 'Note', icon: 'generic-note', category: 'other', defaultColor: '#facc15' },
];
