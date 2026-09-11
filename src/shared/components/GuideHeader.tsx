import { Link } from 'react-router';
import { TbArrowLeft } from 'react-icons/tb';

import { Logo } from '@/shared/icons/Logo';
import { ThemeToggle } from './ThemeToggle';

interface GuideHeaderProps {
  backTo: string;
  label: string;
}

export const GuideHeader = ({ backTo, label }: GuideHeaderProps) => (
  <div className="sticky top-0 z-10 flex h-10 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm">
    <div className="flex items-center gap-3">
      <Link to={backTo} className="text-muted-foreground hover:text-foreground transition-colors">
        <TbArrowLeft className="h-4 w-4" />
      </Link>
      <div className="flex items-center gap-2">
        <Logo size={16} className="text-ink" />
        <span className="text-xs font-bold text-primary tracking-widest">INFRA</span>
        <span className="text-xs text-muted-foreground tracking-wider">{label}</span>
      </div>
    </div>
    <ThemeToggle />
  </div>
);
