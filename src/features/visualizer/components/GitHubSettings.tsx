import { useState, useCallback } from 'react';
import { TbBrandGithub, TbRefresh, TbLoader2, TbTrash } from 'react-icons/tb';

import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { GitHubClient } from '../github/github-client';
import { useGitHubStore } from '../stores/githubStore';
import { useSync } from '../hooks/useSync';

/**
 * GitHub connection settings panel.
 * Handles PAT token input, repo URL parsing, branch selection, and sync trigger.
 */
interface GitHubSettingsProps {
  onSyncComplete?: () => void;
}

export const GitHubSettings = ({ onSyncComplete }: GitHubSettingsProps) => {
  const token = useGitHubStore((s) => s.token);
  const owner = useGitHubStore((s) => s.owner);
  const repo = useGitHubStore((s) => s.repo);
  const branches = useGitHubStore((s) => s.branches);
  const selectedBranch = useGitHubStore((s) => s.selectedBranch);
  const syncStatus = useGitHubStore((s) => s.syncStatus);
  const syncProgress = useGitHubStore((s) => s.syncProgress);
  const syncError = useGitHubStore((s) => s.syncError);

  const setToken = useGitHubStore((s) => s.setToken);
  const setRepo = useGitHubStore((s) => s.setRepo);
  const setBranches = useGitHubStore((s) => s.setBranches);
  const setSelectedBranch = useGitHubStore((s) => s.setSelectedBranch);
  const setSyncError = useGitHubStore((s) => s.setSyncError);
  const clearToken = useGitHubStore((s) => s.clearToken);

  const { sync, loading } = useSync();
  const [repoInput, setRepoInput] = useState(owner && repo ? `${owner}/${repo}` : '');
  const [connecting, setConnecting] = useState(false);

  const handleConnect = useCallback(async () => {
    if (!token || !repoInput) return;

    const parsed = parseRepoInput(repoInput);
    if (!parsed) {
      setSyncError('Invalid repo format. Use "owner/repo" or a GitHub URL.');
      return;
    }

    setConnecting(true);
    try {
      const client = new GitHubClient(token);
      const repoInfo = await client.getRepo(parsed.owner, parsed.repo);
      const branchList = await client.listBranches(parsed.owner, parsed.repo);

      setRepo(parsed.owner, parsed.repo);
      setBranches(branchList);
      setSelectedBranch(repoInfo.default_branch);
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : 'Connection failed.');
    } finally {
      setConnecting(false);
    }
  }, [token, repoInput, setRepo, setBranches, setSelectedBranch, setSyncError]);

  const connected = branches.length > 0;

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-[10px]">Personal Access Token</Label>
        <Input
          type="password"
          placeholder="ghp_..."
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="h-7 text-[11px]"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-[10px]">Repository</Label>
        <Input
          type="text"
          placeholder="owner/repo or GitHub URL"
          value={repoInput}
          onChange={(e) => setRepoInput(e.target.value)}
          className="h-7 text-[11px]"
        />
      </div>

      {!connected && (
        <Button
          size="sm"
          className="h-7 w-full text-[11px]"
          onClick={handleConnect}
          disabled={!token || !repoInput || connecting}
        >
          {connecting ? (
            <TbLoader2 className="h-3 w-3 animate-spin" />
          ) : (
            'Connect'
          )}
        </Button>
      )}

      {connected && (
        <>
          <Separator />
          <div className="space-y-1.5">
            <Label className="text-[10px]">Branch</Label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="h-7 w-full rounded-md border border-border bg-background px-2 text-[11px]"
            >
              {branches.map((b) => (
                <option key={b.name} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>

          <Button
            size="sm"
            className="h-7 w-full text-[11px]"
            onClick={async () => { await sync(); onSyncComplete?.(); }}
            disabled={loading}
          >
            {loading ? (
              <>
                <TbLoader2 className="h-3 w-3 animate-spin" />
                {syncProgress && (
                  <span>{syncProgress.current}/{syncProgress.total}</span>
                )}
              </>
            ) : (
              <>
                <TbRefresh className="h-3 w-3" />
                Sync
              </>
            )}
          </Button>

          {loading && syncProgress && (
            <div className="h-1 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${(syncProgress.current / syncProgress.total) * 100}%` }}
              />
            </div>
          )}
        </>
      )}

      {syncError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-2">
          <p className="text-[10px] text-destructive">{syncError}</p>
        </div>
      )}

      {token && (
        <button
          onClick={clearToken}
          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-destructive transition-colors"
        >
          <TbTrash className="h-3 w-3" />
          Remove saved token
        </button>
      )}
    </div>
  );
};

const parseRepoInput = (input: string): { owner: string; repo: string } | null => {
  const trimmed = input.trim();

  // Handle GitHub URLs
  const urlMatch = /github\.com[/:]([^/]+)\/([^/.]+)/.exec(trimmed);
  if (urlMatch) return { owner: urlMatch[1], repo: urlMatch[2] };

  // Handle owner/repo format
  const parts = trimmed.split('/');
  if (parts.length === 2 && parts[0] && parts[1]) {
    return { owner: parts[0], repo: parts[1] };
  }

  return null;
};
