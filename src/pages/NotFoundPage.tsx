import { useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { TbArrowLeft } from 'react-icons/tb';

import { useUIStore } from '@/stores';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { Logo } from '@/shared/icons/Logo';

export const NotFoundPage = () => {
  const theme = useUIStore((s) => s.theme);
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="flex h-screen w-screen flex-col bg-background overflow-y-auto">
      <div className="sticky top-0 z-10 flex h-10 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <TbArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Logo size={16} className="text-ink" />
            <span className="text-xs font-bold text-primary tracking-widest">INFRA</span>
            <span className="text-xs text-muted-foreground tracking-wider">NOT FOUND</span>
          </div>
        </div>
        <ThemeToggle />
      </div>

      <div className="mx-auto w-full max-w-2xl px-6 py-24">
        <span className="text-[10px] font-semibold tracking-widest text-muted-foreground">404</span>
        <h1 className="mt-2 text-lg font-bold text-foreground tracking-wide">
          This page does not exist
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Nothing is routed to{' '}
          <code className="rounded bg-card px-1.5 py-0.5 text-[11px] text-primary">{pathname}</code>.
          Head back to the Designer or open the Visualizer.
        </p>

        <div className="mt-10 flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2.5 text-xs font-semibold text-background transition-transform hover:-translate-y-px"
          >
            Open Designer
          </Link>
          <Link
            to="/visualizer"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-xs text-foreground transition-colors hover:border-foreground"
          >
            Open Visualizer
          </Link>
        </div>
      </div>
    </div>
  );
};
