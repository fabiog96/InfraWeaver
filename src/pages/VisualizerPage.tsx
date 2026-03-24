import { useEffect } from 'react';
import { Link } from 'react-router';
import { TbArrowLeft, TbTopologyStarRing3 } from 'react-icons/tb';
import { ReactFlowProvider } from '@xyflow/react';

import { useUIStore } from '@/stores';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import {
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent,
  Button, Separator,
} from '@/shared/components/ui';
import { VisualizerCanvas, VisualizerInspector } from '@/features/visualizer/components';
import { useVisualizerStore } from '@/features/visualizer/stores/visualizerStore';

const VisualizerLayout = () => {
  const theme = useUIStore((s) => s.theme);
  const stats = useVisualizerStore((s) => s.stats);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <TooltipProvider delayDuration={300}>
        <div className="flex h-10 items-center justify-between border-b border-border bg-card px-3">
          <div className="flex items-center gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                  <Link to="/">
                    <TbArrowLeft className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Back to home</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-1 h-4" />

            <span className="text-xs font-bold text-primary tracking-widest">ARCH</span>
            <span className="text-xs text-muted-foreground tracking-wider">VISUALIZER</span>

            {stats && (
              <>
                <Separator orientation="vertical" className="mx-1 h-4" />
                <span className="text-[10px] text-muted-foreground">
                  {stats.totalResources} resources from {stats.parsedFiles} files
                </span>
                {stats.totalErrors > 0 && (
                  <span className="text-[10px] text-error">
                    ({stats.totalErrors} errors)
                  </span>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            <ThemeToggle />
          </div>
        </div>
      </TooltipProvider>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex flex-1 flex-col overflow-hidden">
          {stats ? (
            <div className="flex-1 overflow-hidden">
              <VisualizerCanvas />
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-secondary">
                  <TbTopologyStarRing3 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-sm font-bold text-foreground">Infra Visualizer</h2>
                <p className="max-w-sm text-[11px] leading-relaxed text-muted-foreground">
                  Import a Terraform/Terragrunt repository to visualize your infrastructure
                  as an interactive diagram. Upload a ZIP or connect to GitHub.
                </p>
              </div>
            </div>
          )}
        </main>
        <VisualizerInspector />
      </div>
    </div>
  );
};

export const VisualizerPage = () => {
  return (
    <ReactFlowProvider>
      <VisualizerLayout />
    </ReactFlowProvider>
  );
};
