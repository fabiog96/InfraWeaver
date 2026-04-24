import { useEffect } from 'react';
import { Link } from 'react-router';
import { TbPencilBolt, TbTopologyStarRing3 } from 'react-icons/tb';

import { useUIStore } from '@/stores';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { Logo } from '@/shared/icons/Logo';

const modes = [
  {
    to: '/designer',
    icon: TbPencilBolt,
    title: 'Designer',
    description: 'Design cloud architectures on a canvas and generate production-ready Terraform/Terragrunt code.',
  },
  {
    to: '/visualizer',
    icon: TbTopologyStarRing3,
    title: 'Visualizer',
    description: 'Import an existing Terraform repository and explore your infrastructure as an interactive diagram.',
  },
] as const;

export const HomePage = () => {
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="mb-10 flex flex-col items-center gap-3">
        <Logo size={48} className="text-ink" />
        <div className="text-center">
          <h1 className="text-lg font-bold tracking-widest text-primary">INFRAWEAVER</h1>
        </div>
      </div>

      <div className="flex gap-6">
        {modes.map(({ to, icon: Icon, title, description }) => (
          <Link
            key={to}
            to={to}
            className="group flex w-64 flex-col items-center gap-4 rounded-lg border border-border bg-card p-6 transition-all duration-150 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-md bg-secondary transition-colors duration-150 group-hover:bg-primary/10">
              <Icon className="h-7 w-7 text-muted-foreground transition-colors duration-150 group-hover:text-primary" />
            </div>
            <div className="text-center">
              <h2 className="text-sm font-bold text-foreground">{title}</h2>
              <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
