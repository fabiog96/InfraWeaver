import { TbMoon, TbSun } from 'react-icons/tb';

import { useUIStore } from '@/stores';
import { Button } from '@/shared/components/ui';

export const ThemeToggle = () => {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);

  const toggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <Button variant="ghost" size="icon" onClick={toggle} className="h-6 w-6">
      {theme === 'dark'
        ? <TbSun className="h-3.5 w-3.5" />
        : <TbMoon className="h-3.5 w-3.5" />}
    </Button>
  );
};
