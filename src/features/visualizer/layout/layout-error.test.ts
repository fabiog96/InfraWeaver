import { describe, expect, it } from 'vitest';

import { toLayoutError } from './layout-error';

describe('toLayoutError', () => {
  it('quotes what the layout engine complained about', () => {
    const error = toLayoutError(new Error('dagre ran out of ranks'));

    expect(error.level).toBe('layout_error');
    expect(error.message).toContain('dagre ran out of ranks');
  });

  it('reads a failure thrown as a bare string', () => {
    expect(toLayoutError('node has no size').message).toContain('node has no size');
  });

  it('still says something when the failure carries no reason', () => {
    for (const thrown of [undefined, null, {}, '   ', new Error('')]) {
      const error = toLayoutError(thrown);

      expect(typeof error.message).toBe('string');
      expect(error.message.length).toBeGreaterThan(0);
    }
  });

  it('carries a location the error panel can render', () => {
    const error = toLayoutError(new Error('boom'));

    expect(typeof error.filePath).toBe('string');
    expect(error.filePath.length).toBeGreaterThan(0);
  });
});
