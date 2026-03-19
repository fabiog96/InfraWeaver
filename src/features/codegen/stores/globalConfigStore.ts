import { create } from 'zustand';

import { useShallow } from 'zustand/shallow';

import type { GlobalConfig } from '../types';

interface GlobalConfigState extends GlobalConfig {
  setField: (field: keyof GlobalConfig, value: string) => void;
  setConfig: (config: Partial<GlobalConfig>) => void;
}

const deriveStateBucket = (project: string, environment: string): string =>
  `${project}-${environment}-tfstate`.replace(/[^a-z0-9-]/g, '');

const deriveLockTable = (project: string, environment: string): string =>
  `${project}-${environment}-tflock`.replace(/[^a-z0-9-]/g, '');

export const useGlobalConfigStore = create<GlobalConfigState>((set) => ({
  region: 'eu-west-1',
  environment: 'dev',
  project: 'my-project',
  subproject: 'infra',
  stateBucket: deriveStateBucket('my-project', 'dev'),
  lockTable: deriveLockTable('my-project', 'dev'),
  cicdProvider: 'github-actions',

  setField: (field, value) =>
    set((state) => {
      const next = { ...state, [field]: value };
      if (field === 'project' || field === 'environment') {
        const project = field === 'project' ? value : state.project;
        const environment = field === 'environment' ? value : state.environment;
        next.stateBucket = deriveStateBucket(project, environment);
        next.lockTable = deriveLockTable(project, environment);
      }
      return next;
    }),

  setConfig: (config) =>
    set((state) => {
      const next = { ...state, ...config };
      if (config.project || config.environment) {
        next.stateBucket = deriveStateBucket(next.project, next.environment);
        next.lockTable = deriveLockTable(next.project, next.environment);
      }
      return next;
    }),
}));

export const useGlobalConfig = (): GlobalConfig =>
  useGlobalConfigStore(
    useShallow((s) => ({
      region: s.region,
      environment: s.environment,
      project: s.project,
      subproject: s.subproject,
      stateBucket: s.stateBucket,
      lockTable: s.lockTable,
      cicdProvider: s.cicdProvider,
    })),
  );
