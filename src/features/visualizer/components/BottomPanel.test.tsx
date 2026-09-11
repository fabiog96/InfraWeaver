import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { toLayoutError } from '../layout/layout-error';
import type { ParseError } from '../parser/types';
import { BottomPanel } from './BottomPanel';

const parseError: ParseError = {
  level: 'parse_error',
  filePath: 'broken.tf',
  message: 'The HCL parser rejected this file without reporting a reason.',
};

const objectMessageError = { ...parseError, message: {} } as unknown as ParseError;

let errors: ParseError[] = [];

vi.mock('../stores/visualizerStore', () => ({
  useVisualizerStore: (selector: (state: { errors: ParseError[] }) => unknown) =>
    selector({ errors }),
}));

const render = (list: ParseError[]): string => {
  errors = list;
  return renderToStaticMarkup(<BottomPanel defaultExpanded />);
};

describe('BottomPanel', () => {
  it('renders a parse error without throwing', () => {
    const markup = render([parseError]);

    expect(markup).toContain('1 parse');
    expect(markup).toContain('rejected this file without reporting a reason');
  });

  it('renders nothing when there is no error', () => {
    expect(render([])).toBe('');
  });

  it('renders a layout failure alongside the parse errors', () => {
    const markup = render([parseError, toLayoutError(new Error('dagre ran out of ranks'))]);

    expect(markup).toContain('2 errors');
    expect(markup).toContain('dagre ran out of ranks');
    expect(markup).toContain('rejected this file without reporting a reason');
  });

  it('survives a parse error whose message is not a string', () => {
    expect(() => render([objectMessageError])).not.toThrow();
  });
});
