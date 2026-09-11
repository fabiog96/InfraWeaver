import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  clearPositions,
  loadPositions,
  pruneStalePositions,
  savePositions,
} from './position-persistence';

const installMemoryStorage = (): Map<string, string> => {
  const entries = new Map<string, string>();

  vi.stubGlobal('localStorage', {
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => {
      entries.set(key, value);
    },
    removeItem: (key: string) => {
      entries.delete(key);
    },
  });

  return entries;
};

const installUnwritableStorage = (): void => {
  vi.stubGlobal('localStorage', {
    getItem: () => null,
    setItem: () => {
      throw new Error('QuotaExceededError');
    },
    removeItem: () => {},
  });
};

let storage: Map<string, string>;

beforeEach(() => {
  storage = installMemoryStorage();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('savePositions / loadPositions', () => {
  it('reads back exactly what was written', () => {
    const positions = {
      'module.report_downloader_service': { x: 100, y: 200 },
      'resource.aws_s3_bucket.report_downloads': { x: -40, y: 15.5 },
    };

    savePositions('acme/infra', 'main', positions);

    expect(loadPositions('acme/infra', 'main')).toEqual(positions);
  });

  it('returns an empty object when nothing was ever saved', () => {
    expect(loadPositions('acme/infra', 'main')).toEqual({});
  });

  it('keeps each repo and branch pair in its own entry', () => {
    savePositions('acme/infra', 'main', { 'resource.aws_sqs_queue.jobs': { x: 1, y: 2 } });
    savePositions('acme/infra', 'develop', { 'resource.aws_sqs_queue.jobs': { x: 3, y: 4 } });
    savePositions('acme/other', 'main', { 'resource.aws_sqs_queue.jobs': { x: 5, y: 6 } });

    expect(loadPositions('acme/infra', 'main')).toEqual({
      'resource.aws_sqs_queue.jobs': { x: 1, y: 2 },
    });
    expect(loadPositions('acme/infra', 'develop')).toEqual({
      'resource.aws_sqs_queue.jobs': { x: 3, y: 4 },
    });
    expect(loadPositions('acme/other', 'main')).toEqual({
      'resource.aws_sqs_queue.jobs': { x: 5, y: 6 },
    });
  });

  it('overwrites the previous entry instead of merging into it', () => {
    savePositions('acme/infra', 'main', { 'resource.a': { x: 1, y: 1 } });
    savePositions('acme/infra', 'main', { 'resource.b': { x: 2, y: 2 } });

    expect(loadPositions('acme/infra', 'main')).toEqual({ 'resource.b': { x: 2, y: 2 } });
  });

  it('returns an empty object when the stored payload is not valid JSON', () => {
    savePositions('acme/infra', 'main', { 'resource.a': { x: 1, y: 1 } });
    const [savedKey] = [...storage.keys()];
    storage.set(savedKey, '{ not json');

    expect(loadPositions('acme/infra', 'main')).toEqual({});
  });

  it('swallows a storage that refuses to write', () => {
    installUnwritableStorage();

    expect(() =>
      savePositions('acme/infra', 'main', { 'resource.a': { x: 1, y: 1 } }),
    ).not.toThrow();
  });
});

describe('clearPositions', () => {
  it('drops the entry for that repo and branch only', () => {
    savePositions('acme/infra', 'main', { 'resource.a': { x: 1, y: 1 } });
    savePositions('acme/infra', 'develop', { 'resource.a': { x: 2, y: 2 } });

    clearPositions('acme/infra', 'main');

    expect(loadPositions('acme/infra', 'main')).toEqual({});
    expect(loadPositions('acme/infra', 'develop')).toEqual({ 'resource.a': { x: 2, y: 2 } });
  });
});

describe('pruneStalePositions', () => {
  it('keeps the nodes still in the graph and forgets the others', () => {
    savePositions('acme/infra', 'main', {
      'resource.aws_s3_bucket.kept': { x: 10, y: 20 },
      'resource.aws_s3_bucket.removed': { x: 30, y: 40 },
    });

    pruneStalePositions('acme/infra', 'main', new Set(['resource.aws_s3_bucket.kept']));

    expect(loadPositions('acme/infra', 'main')).toEqual({
      'resource.aws_s3_bucket.kept': { x: 10, y: 20 },
    });
  });

  it('empties the entry when the graph no longer holds any saved node', () => {
    savePositions('acme/infra', 'main', { 'resource.aws_s3_bucket.gone': { x: 1, y: 2 } });

    pruneStalePositions('acme/infra', 'main', new Set());

    expect(loadPositions('acme/infra', 'main')).toEqual({});
  });

  it('does not invent entries for graph nodes that were never positioned', () => {
    savePositions('acme/infra', 'main', { 'resource.aws_s3_bucket.kept': { x: 10, y: 20 } });

    pruneStalePositions(
      'acme/infra',
      'main',
      new Set(['resource.aws_s3_bucket.kept', 'resource.aws_sqs_queue.never_moved']),
    );

    expect(loadPositions('acme/infra', 'main')).toEqual({
      'resource.aws_s3_bucket.kept': { x: 10, y: 20 },
    });
  });
});
