import { useEffect } from 'react';

import type { Theme } from '@/shared/types';
import { useUIStore } from '@/stores';

type ThemeRoot = {
  setAttribute: (name: string, value: string) => void;
  classList: { toggle: (token: string, force: boolean) => void };
};

export const applyTheme = (theme: Theme, root: ThemeRoot) => {
  root.setAttribute('data-theme', theme);
  root.classList.toggle('dark', theme === 'dark');
};

export const useThemeSync = () => {
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    applyTheme(theme, document.documentElement);
  }, [theme]);
};
