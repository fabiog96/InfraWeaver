import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import type { ParseError } from '../parser/types';
import { BottomPanel } from './BottomPanel';

const parseError: ParseError = {
  level: 'parse_error',
  filePath: 'broken.tf',
  message: 'The HCL parser rejected this file without reporting a reason.',
};

/** What #46 shipped: the parser's error object smuggled into a field typed string. */
const objectMessageError = { ...parseError, message: {} } as unknown as ParseError;

let errors: ParseError[] = [];

/**
 * Zustand v5 serves `getInitialState` as the SSR snapshot, so a `setState` made here would
 * be invisible to `renderToStaticMarkup`. The store is replaced by the selector it exposes.
 */
vi.mock('../stores/visualizerStore', () => ({
  useVisualizerStore: (selector: (state: { errors: ParseError[] }) => unknown) =>
    selector({ errors }),
}));

const render = (list: ParseError[]): string => {
  errors = list;
  return renderToStaticMarkup(<BottomPanel />);
};

describe('BottomPanel', () => {
  it('renders a parse error without throwing', () => {
    expect(render([parseError])).toContain('1 parse');
  });

  it('renders nothing when there is no error', () => {
    expect(render([])).toBe('');
  });

  it('survives a parse error whose message is not a string', () => {
    expect(() => render([objectMessageError])).not.toThrow();
  });
});
