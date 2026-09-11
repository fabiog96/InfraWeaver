import { describe, expect, it } from 'vitest';

import { applyTheme } from './useThemeSync';

const fakeRoot = () => {
  const classes = new Set<string>();
  const attributes = new Map<string, string>();

  return {
    attributes,
    classes,
    setAttribute: (name: string, value: string) => void attributes.set(name, value),
    classList: {
      toggle: (name: string, force: boolean) => {
        if (force) classes.add(name);
        else classes.delete(name);
      },
    },
  };
};

describe('applyTheme', () => {
  it('marks the root as dark', () => {
    const root = fakeRoot();

    applyTheme('dark', root);

    expect(root.attributes.get('data-theme')).toBe('dark');
    expect(root.classes.has('dark')).toBe(true);
  });

  it('marks the root as light', () => {
    const root = fakeRoot();

    applyTheme('light', root);

    expect(root.attributes.get('data-theme')).toBe('light');
    expect(root.classes.has('dark')).toBe(false);
  });

  it('drops the dark class when the theme goes back to light', () => {
    const root = fakeRoot();

    applyTheme('dark', root);
    applyTheme('light', root);

    expect(root.attributes.get('data-theme')).toBe('light');
    expect(root.classes.has('dark')).toBe(false);
  });
});
