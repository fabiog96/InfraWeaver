import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { ParseError } from '../parser/types';
import { ParseErrorRow } from './ParseErrorRow';

const parseError: ParseError = {
  level: 'parse_error',
  filePath: 'broken.tf',
  message: 'The HCL parser rejected this file without reporting a reason.',
  suggestion: 'Check for unclosed brackets, missing quotes, or unsupported HCL syntax.',
};

const render = (error: ParseError): string => renderToStaticMarkup(<ParseErrorRow error={error} />);

describe('ParseErrorRow', () => {
  it('shows the file, the message and the suggestion', () => {
    const markup = render({ ...parseError, line: 3 });

    expect(markup).toContain('broken.tf:3');
    expect(markup).toContain('rejected this file without reporting a reason');
    expect(markup).toContain('Check for unclosed brackets');
  });

  it('renders a non-string message as text instead of throwing', () => {
    const hostile = { ...parseError, message: {} } as unknown as ParseError;

    expect(() => render(hostile)).not.toThrow();
  });

  it('renders a line that is not a number as no line at all', () => {
    const hostile = { ...parseError, line: Symbol('nope') } as unknown as ParseError;

    expect(() => renderToStaticMarkup(<ParseErrorRow error={hostile} />)).not.toThrow();
    expect(renderToStaticMarkup(<ParseErrorRow error={hostile} />)).toContain('broken.tf');
  });

  it('renders a non-string snippet and suggestion as text instead of throwing', () => {
    const hostile = { ...parseError, snippet: {}, suggestion: [] } as unknown as ParseError;

    expect(() => render(hostile)).not.toThrow();
  });

  it('omits the snippet and the suggestion when they are absent', () => {
    const markup = render({ level: 'parse_error', filePath: 'broken.tf', message: 'boom' });

    expect(markup).not.toContain('<pre');
    expect(markup).toContain('boom');
  });
});
