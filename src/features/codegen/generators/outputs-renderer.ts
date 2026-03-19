import type { ModuleOutput } from '../types';

export const renderOutputsTf = (outputs: ModuleOutput[]): string => {
  if (outputs.length === 0) return '';

  const blocks: string[] = [];

  for (const output of outputs) {
    const lines: string[] = [];
    lines.push(`output "${output.name}" {`);
    lines.push(`  description = "${output.description}"`);
    lines.push(`  value       = ${output.terraformExpression}`);
    lines.push('}');
    blocks.push(lines.join('\n'));
  }

  return blocks.join('\n\n') + '\n';
};
