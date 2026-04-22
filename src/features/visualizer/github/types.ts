export interface RepoInfo {
  owner: string;
  repo: string;
  default_branch: string;
}

export interface BranchInfo {
  name: string;
  sha: string;
}

export interface TreeEntry {
  path: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
}

export interface RepoFile {
  path: string;
  content: string;
}

export type SyncStatus = 'idle' | 'fetching' | 'parsing' | 'discovering' | 'done' | 'error';

export interface SyncProgress {
  current: number;
  total: number;
}
