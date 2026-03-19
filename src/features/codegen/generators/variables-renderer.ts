import type { ModuleInput } from '../types';

const tfTypeMap: Record<string, string> = {
  string: 'string',
  number: 'number',
  bool: 'bool',
  list: 'list(string)',
  map: 'map(string)',
};

const formatDefault = (value: unknown, type: string): string => {
  if (type === 'number') return String(value);
  if (type === 'bool') return value ? 'true' : 'false';
  if (type === 'list' || type === 'map') {
    return typeof value === 'string' ? value : JSON.stringify(value);
  }
  return `"${String(value)}"`;
};

export const renderVariablesTf = (inputs: ModuleInput[]): string => {
  if (inputs.length === 0) return '';

  const blocks: string[] = [];

  for (const input of inputs) {
    const lines: string[] = [];
    lines.push(`variable "${input.name}" {`);
    lines.push(`  description = "${input.description}"`);
    lines.push(`  type        = ${tfTypeMap[input.type] || 'string'}`);

    if (input.default !== undefined) {
      lines.push(`  default     = ${formatDefault(input.default, input.type)}`);
    }

    lines.push('}');
    blocks.push(lines.join('\n'));
  }

  return blocks.join('\n\n') + '\n';
};
