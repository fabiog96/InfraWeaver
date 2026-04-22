import type { RepoInfo, BranchInfo, TreeEntry, RepoFile } from './types';

const API_BASE = 'https://api.github.com';
const BATCH_SIZE = 5;

/**
 * GitHub API client for fetching Terraform files from a repository.
 * Uses the Trees API for efficient file listing and Contents API for file content.
 */
export class GitHubClient {
  private headers: Record<string, string>;

  constructor(token: string) {
    this.headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
  }

  async getRepo(owner: string, repo: string): Promise<RepoInfo> {
    const res = await fetch(`${API_BASE}/repos/${owner}/${repo}`, {
      headers: this.headers,
    });

    if (!res.ok) throw new Error(this.describeError(res.status, owner, repo));

    const data = await res.json();
    return {
      owner,
      repo,
      default_branch: data.default_branch,
    };
  }

  async listBranches(owner: string, repo: string): Promise<BranchInfo[]> {
    const res = await fetch(
      `${API_BASE}/repos/${owner}/${repo}/branches?per_page=100`,
      { headers: this.headers },
    );

    if (!res.ok) throw new Error(this.describeError(res.status, owner, repo));

    const data = await res.json();
    return (data as { name: string; commit: { sha: string } }[]).map((b) => ({
      name: b.name,
      sha: b.commit.sha,
    }));
  }

  async getTree(owner: string, repo: string, sha: string): Promise<TreeEntry[]> {
    const res = await fetch(
      `${API_BASE}/repos/${owner}/${repo}/git/trees/${sha}?recursive=1`,
      { headers: this.headers },
    );

    if (!res.ok) throw new Error(this.describeError(res.status, owner, repo));

    const data = await res.json();
    return (data.tree as TreeEntry[]).filter((e) => e.type === 'blob');
  }

  async getFileContent(owner: string, repo: string, path: string, ref: string): Promise<string> {
    const res = await fetch(
      `${API_BASE}/repos/${owner}/${repo}/contents/${path}?ref=${ref}`,
      { headers: this.headers },
    );

    if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);

    const data = await res.json();
    return atob(data.content);
  }

  /**
   * Fetches all files matching the given extensions from a repository branch.
   * Downloads in batches of 5 to avoid rate limiting.
   */
  async getRepoFiles(
    owner: string,
    repo: string,
    branch: string,
    extensions: string[],
    onProgress?: (current: number, total: number) => void,
  ): Promise<RepoFile[]> {
    const branches = await this.listBranches(owner, repo);
    const branchInfo = branches.find((b) => b.name === branch);
    if (!branchInfo) throw new Error(`Branch "${branch}" not found.`);

    const tree = await this.getTree(owner, repo, branchInfo.sha);
    const matchingFiles = tree.filter((entry) =>
      extensions.some((ext) => entry.path.endsWith(ext)) &&
      !entry.path.includes('.terraform.lock'),
    );

    const total = matchingFiles.length;
    const files: RepoFile[] = [];

    for (let i = 0; i < matchingFiles.length; i += BATCH_SIZE) {
      const batch = matchingFiles.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(
        batch.map(async (entry) => {
          const content = await this.getFileContent(owner, repo, entry.path, branch);
          return { path: entry.path, content };
        }),
      );
      files.push(...results);
      onProgress?.(Math.min(i + BATCH_SIZE, total), total);
    }

    return files;
  }

  private describeError(status: number, owner: string, repo: string): string {
    switch (status) {
      case 401:
        return 'Invalid or expired GitHub token. Please check your PAT.';
      case 403:
        return 'Access denied. Your token may lack the required permissions (repo scope).';
      case 404:
        return `Repository "${owner}/${repo}" not found. Check the name or token permissions.`;
      default:
        return `GitHub API error: ${status}`;
    }
  }
}
