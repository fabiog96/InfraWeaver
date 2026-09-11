import { describe, expect, it } from 'vitest';

import { toParseError } from './parse-error';

const content = [
  'resource "aws_s3_bucket" "report_downloads" {',
  '  bucket = "report-downloads-${var.env}"',
  '  tags = {',
  '    terraform = true',
].join('\n');

describe('toParseError — normalising whatever the parser throws at us', () => {
  it('keeps a string error as the message', () => {
    expect(toParseError('missing closing brace', 'broken.tf', content)).toMatchObject({
      level: 'parse_error',
      filePath: 'broken.tf',
      message: 'missing closing brace',
    });
  });

  it('unwraps an Error into its message', () => {
    expect(toParseError(new Error('unexpected token'), 'broken.tf', content).message).toBe(
      'unexpected token',
    );
  });

  it('falls back to our own text when the parser reports an empty object', () => {
    const error = toParseError({}, 'broken.tf', content);

    expect(typeof error.message).toBe('string');
    expect(error.message).not.toBe('[object Object]');
    expect(error.message).toMatch(/without reporting a reason/i);
  });

  it('falls back to our own text when the parser reports nothing at all', () => {
    expect(toParseError(null, 'broken.tf', content).message).toMatch(/without reporting a reason/i);
    expect(toParseError(undefined, 'broken.tf', content).message).toMatch(
      /without reporting a reason/i,
    );
  });

  it('survives an error object that cannot be serialised', () => {
    const circular: Record<string, unknown> = { detail: 'unclosed brace' };
    circular.self = circular;

    expect(() => toParseError(circular, 'broken.tf', content)).not.toThrow();
    expect(typeof toParseError(circular, 'broken.tf', content).message).toBe('string');
  });

  it('falls back to our own text for an empty array', () => {
    expect(toParseError([], 'broken.tf', content).message).toMatch(/without reporting a reason/i);
  });

  it('serialises an object that does carry information', () => {
    expect(toParseError({ detail: 'unclosed brace' }, 'broken.tf', content).message).toContain(
      'unclosed brace',
    );
  });

  it('always carries the unclosed-bracket suggestion', () => {
    expect(toParseError({}, 'broken.tf', content).suggestion).toBe(
      'Check for unclosed brackets, missing quotes, or unsupported HCL syntax.',
    );
  });
});

describe('toParseError — line and snippet', () => {
  it('reads the line out of an "on <file> line N" message and snippets around it', () => {
    const error = toParseError('on broken.tf line 3, in resource block', 'broken.tf', content);

    expect(error.line).toBe(3);
    expect(error.snippet).toBe(
      [
        '  2 |   bucket = "report-downloads-${var.env}"',
        '> 3 |   tags = {',
        '  4 |     terraform = true',
      ].join('\n'),
    );
  });

  it('reads the line out of a "file:42:" style message', () => {
    expect(toParseError('broken.tf:2:11: unexpected token', 'broken.tf', content).line).toBe(2);
  });

  it('leaves line and snippet undefined when the message carries no line reference', () => {
    const error = toParseError({}, 'broken.tf', content);

    expect(error.line).toBeUndefined();
    expect(error.snippet).toBeUndefined();
  });

  it('drops a line that is past the end of the file instead of pointing at it', () => {
    const error = toParseError('on broken.tf line 99, in resource block', 'broken.tf', content);

    expect(error.line).toBeUndefined();
    expect(error.snippet).toBeUndefined();
  });

  it('does not read a line number out of a clock time', () => {
    expect(toParseError('Parse failed at 10:30, please retry', 'broken.tf', content).line).toBeUndefined();
  });

  it('does not read a line number out of prose that merely contains a colon', () => {
    for (const message of ['HTTP 500: internal error', 'expected 1 of: foo, bar']) {
      expect(toParseError(message, 'broken.tf', content).line).toBeUndefined();
    }
  });
});
