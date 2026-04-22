import { create } from 'zustand';

import type { BranchInfo, SyncStatus, SyncProgress } from '../github/types';

interface GitHubState {
  token: string;
  owner: string;
  repo: string;
  branches: BranchInfo[];
  selectedBranch: string;
  syncStatus: SyncStatus;
  syncProgress: SyncProgress | null;
  syncError: string | null;
  lastSyncAt: Date | null;

  setToken: (token: string) => void;
  setRepo: (owner: string, repo: string) => void;
  setBranches: (branches: BranchInfo[]) => void;
  setSelectedBranch: (branch: string) => void;
  setSyncStatus: (status: SyncStatus) => void;
  setSyncProgress: (current: number, total: number) => void;
  setSyncError: (error: string) => void;
  setLastSyncAt: (date: Date) => void;
  clearToken: () => void;
}

const STORAGE_KEY_TOKEN = 'viz:github:token';
const STORAGE_KEY_REPO = 'viz:github:repo';

export const useGitHubStore = create<GitHubState>((set) => ({
  token: localStorage.getItem(STORAGE_KEY_TOKEN) ?? '',
  owner: (() => {
    const saved = localStorage.getItem(STORAGE_KEY_REPO);
    return saved ? saved.split('/')[0] : '';
  })(),
  repo: (() => {
    const saved = localStorage.getItem(STORAGE_KEY_REPO);
    return saved ? saved.split('/')[1] ?? '' : '';
  })(),
  branches: [],
  selectedBranch: '',
  syncStatus: 'idle',
  syncProgress: null,
  syncError: null,
  lastSyncAt: null,

  setToken: (token) => {
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
    set({ token, syncError: null });
  },

  setRepo: (owner, repo) => {
    localStorage.setItem(STORAGE_KEY_REPO, `${owner}/${repo}`);
    set({ owner, repo, syncError: null });
  },

  setBranches: (branches) => set({ branches }),

  setSelectedBranch: (selectedBranch) => set({ selectedBranch }),

  setSyncStatus: (syncStatus) => set({
    syncStatus,
    ...(syncStatus === 'error' ? {} : { syncError: null }),
    ...(syncStatus === 'idle' ? { syncProgress: null } : {}),
  }),

  setSyncProgress: (current, total) => set({ syncProgress: { current, total } }),

  setSyncError: (syncError) => set({ syncError, syncStatus: 'error', syncProgress: null }),

  setLastSyncAt: (lastSyncAt) => set({ lastSyncAt }),

  clearToken: () => {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    set({ token: '', syncError: null });
  },
}));
