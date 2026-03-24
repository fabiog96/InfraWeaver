const STORAGE_PREFIX = 'viz:positions:';

/**
 * Builds the localStorage key for a specific repo + branch combination.
 *
 * @example
 * buildStorageKey('devops-farm-tf', 'main')
 * // → 'viz:positions:devops-farm-tf:main'
 */
const buildStorageKey = (repo: string, branch: string): string => {
  return `${STORAGE_PREFIX}${repo}:${branch}`;
};

interface SavedPositions {
  [nodeId: string]: { x: number; y: number };
}

/**
 * Saves node positions to localStorage for a given repo and branch (D7).
 * Only stores nodes that have been manually repositioned.
 * Positions persist across page reloads and re-syncs.
 *
 * @example
 * savePositions('devops-farm-tf', 'main', {
 *   'module.campaign_proximity_service': { x: 100, y: 200 },
 *   'resource.aws_s3_bucket.my_bucket': { x: 300, y: 400 },
 * });
 */
export const savePositions = (
  repo: string,
  branch: string,
  positions: SavedPositions,
): void => {
  try {
    const key = buildStorageKey(repo, branch);
    localStorage.setItem(key, JSON.stringify(positions));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
};

/**
 * Loads previously saved node positions from localStorage.
 * Returns an empty object if no positions are saved or localStorage is unavailable.
 *
 * @example
 * const positions = loadPositions('devops-farm-tf', 'main');
 * // → { 'module.campaign_proximity_service': { x: 100, y: 200 }, ... }
 */
export const loadPositions = (
  repo: string,
  branch: string,
): SavedPositions => {
  try {
    const key = buildStorageKey(repo, branch);
    const stored = localStorage.getItem(key);
    if (!stored) return {};
    return JSON.parse(stored) as SavedPositions;
  } catch {
    return {};
  }
};

/**
 * Removes all saved positions for a given repo and branch.
 * Called when the user clicks "Reset Layout" in the toolbar.
 */
export const clearPositions = (repo: string, branch: string): void => {
  try {
    const key = buildStorageKey(repo, branch);
    localStorage.removeItem(key);
  } catch {
    // silently ignore
  }
};

/**
 * Removes node IDs from saved positions that no longer exist in the graph.
 * Called after a re-sync to keep the persisted data clean.
 *
 * @example
 * // If node "resource.aws_s3_bucket.old_bucket" was removed from the repo,
 * // it gets pruned from the saved positions.
 * pruneStalePositions('devops-farm-tf', 'main', currentNodeIds);
 */
export const pruneStalePositions = (
  repo: string,
  branch: string,
  currentNodeIds: Set<string>,
): void => {
  const positions = loadPositions(repo, branch);
  const pruned: SavedPositions = {};

  for (const [nodeId, pos] of Object.entries(positions)) {
    if (currentNodeIds.has(nodeId)) {
      pruned[nodeId] = pos;
    }
  }

  savePositions(repo, branch, pruned);
};
