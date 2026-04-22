import { useCallback } from 'react';

import { GitHubClient } from '../github/github-client';
import { parseFiles } from '../parser/hcl-parser';
import { resolveRelationships, enrichNodesWithProjects } from '../resolver/relationship-resolver';
import { useGitHubStore } from '../stores/githubStore';
import { useVisualizerStore } from '../stores/visualizerStore';

/**
 * Orchestrates the full sync pipeline:
 * GitHub fetch → HCL parse → project discovery → relationship resolve → enrich → store.
 */
export const useSync = () => {
  const token = useGitHubStore((s) => s.token);
  const owner = useGitHubStore((s) => s.owner);
  const repo = useGitHubStore((s) => s.repo);
  const selectedBranch = useGitHubStore((s) => s.selectedBranch);
  const setSyncStatus = useGitHubStore((s) => s.setSyncStatus);
  const setSyncProgress = useGitHubStore((s) => s.setSyncProgress);
  const setSyncError = useGitHubStore((s) => s.setSyncError);
  const setLastSyncAt = useGitHubStore((s) => s.setLastSyncAt);

  const setGraph = useVisualizerStore((s) => s.setGraph);
  const setErrors = useVisualizerStore((s) => s.setErrors);
  const setStats = useVisualizerStore((s) => s.setStats);
  const setProjectCatalog = useVisualizerStore((s) => s.setProjectCatalog);

  const sync = useCallback(async () => {
    if (!token || !owner || !repo || !selectedBranch) {
      setSyncError('Please configure GitHub token, repository, and branch before syncing.');
      return;
    }

    try {
      // 1. Fetch .tf files from GitHub
      setSyncStatus('fetching');
      const client = new GitHubClient(token);
      const files = await client.getRepoFiles(
        owner, repo, selectedBranch, ['.tf'],
        (current, total) => setSyncProgress(current, total),
      );

      // 2. Parse HCL
      setSyncStatus('parsing');
      const parseResult = await parseFiles(
        files.map((f) => ({ path: f.path, content: f.content })),
      );

      // 3. Resolve relationships
      const { nodes, edges, errors: resolveErrors } = resolveRelationships(parseResult.files);
      const allErrors = [...parseResult.errors, ...resolveErrors];

      // 4. Discover projects + enrich nodes
      setSyncStatus('discovering');
      const { nodes: enrichedNodes, catalog } = enrichNodesWithProjects(nodes, parseResult.files);

      // 5. Store results
      setGraph(enrichedNodes, edges);
      setProjectCatalog(catalog);
      setErrors(allErrors);
      setStats({
        totalFiles: files.length,
        parsedFiles: parseResult.stats.parsedFiles,
        skippedFiles: parseResult.stats.skippedFiles,
        totalResources: parseResult.stats.totalResources,
        totalErrors: allErrors.length,
      });

      setSyncStatus('done');
      setLastSyncAt(new Date());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error during sync.';
      setSyncError(message);
    }
  }, [
    token, owner, repo, selectedBranch,
    setSyncStatus, setSyncProgress, setSyncError, setLastSyncAt,
    setGraph, setErrors, setStats, setProjectCatalog,
  ]);

  const loading = useGitHubStore(
    (s) => s.syncStatus === 'fetching' || s.syncStatus === 'parsing' || s.syncStatus === 'discovering',
  );

  return { sync, loading };
};
