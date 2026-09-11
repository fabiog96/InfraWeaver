import { describe, expect, it } from 'vitest';

import type { ModuleInput } from '../types';
import { renderVariablesTf } from './variables-renderer';

const input = (overrides: Partial<ModuleInput> & Pick<ModuleInput, 'name'>): ModuleInput => ({
  type: 'string',
  required: false,
  description: `the ${overrides.name}`,
  ...overrides,
});

describe('renderVariablesTf', () => {
  it('returns an empty file when the module declares no input', () => {
    expect(renderVariablesTf([])).toBe('');
  });

  it('renders a variable block with description and type', () => {
    const tf = renderVariablesTf([
      input({ name: 'bucket_name', description: 'S3 bucket name', required: true }),
    ]);

    expect(tf).toBe(
      [
        'variable "bucket_name" {',
        '  description = "S3 bucket name"',
        '  type        = string',
        '}',
        '',
      ].join('\n'),
    );
  });

  it('emits the default only when the input declares one', () => {
    expect(renderVariablesTf([input({ name: 'versioning', default: 'Enabled' })])).toContain(
      '  default     = "Enabled"',
    );
    expect(renderVariablesTf([input({ name: 'versioning' })])).not.toContain('default');
  });

  it('maps each input type onto its terraform counterpart', () => {
    const tf = renderVariablesTf([
      input({ name: 'bucket_name', type: 'string' }),
      input({ name: 'memory_size', type: 'number' }),
      input({ name: 'publish', type: 'bool' }),
      input({ name: 'layers', type: 'list' }),
      input({ name: 'tags', type: 'map' }),
    ]);

    expect(tf).toContain('type        = string');
    expect(tf).toContain('type        = number');
    expect(tf).toContain('type        = bool');
    expect(tf).toContain('type        = list(string)');
    expect(tf).toContain('type        = map(string)');
  });

  it('formats the default according to the input type', () => {
    const tf = renderVariablesTf([
      input({ name: 'memory_size', type: 'number', default: 256 }),
      input({ name: 'publish', type: 'bool', default: false }),
      input({ name: 'layers', type: 'list', default: ['arn:layer'] }),
      input({ name: 'tags', type: 'map', default: { team: 'infra' } }),
    ]);

    expect(tf).toContain('  default     = 256');
    expect(tf).toContain('  default     = false');
    expect(tf).toContain('  default     = ["arn:layer"]');
    expect(tf).toContain('  default     = {"team":"infra"}');
  });

  it('separates two variable blocks with a blank line', () => {
    const tf = renderVariablesTf([input({ name: 'first' }), input({ name: 'second' })]);

    expect(tf).toContain('}\n\nvariable "second" {');
  });
});
