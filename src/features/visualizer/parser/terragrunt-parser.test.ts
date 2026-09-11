import { describe, expect, it } from 'vitest';

import { parseTerragruntContent } from './terragrunt-parser';

describe('parseTerragruntContent — a file that does not parse', () => {
  it('reports a renderable string message instead of the parser empty object', async () => {
    const result = await parseTerragruntContent('include {\n  path = find_in_parent(', 'terragrunt.hcl');

    expect(result.config).toBeNull();
    expect(result.errors).toHaveLength(1);
    expect(typeof result.errors[0].message).toBe('string');
    expect(result.errors[0]).toMatchObject({ level: 'parse_error', filePath: 'terragrunt.hcl' });
    expect(result.errors[0].message).not.toBe('[object Object]');
  });
});
