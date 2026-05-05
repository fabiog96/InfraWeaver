import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { TbArrowLeft, TbTopologyStarRing3, TbSettings, TbAlertTriangle } from 'react-icons/tb';
import { ReactFlowProvider } from '@xyflow/react';

import { useUIStore } from '@/stores';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { Logo } from '@/shared/icons/Logo';
import {
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent,
  Button, Separator,
} from '@/shared/components/ui';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/shared/components/ui/dialog';
import {
  VisualizerCanvas,
  VisualizerInspector,
  GitHubSettings,
  ProjectSidebar,
  BottomPanel,
} from '@/features/visualizer/components';
import { useVisualizerStore } from '@/features/visualizer/stores/visualizerStore';
import { useGitHubStore } from '@/features/visualizer/stores/githubStore';
import { useProjectVisualization } from '@/features/visualizer/hooks/useProjectVisualization';

const VisualizerLayout = () => {
  const theme = useUIStore((s) => s.theme);
  const stats = useVisualizerStore((s) => s.stats);
  const errors = useVisualizerStore((s) => s.errors);
  const projectCatalog = useVisualizerStore((s) => s.projectCatalog);
  const selectedProject = useVisualizerStore((s) => s.selectedProject);
  const token = useGitHubStore((s) => s.token);
  const [settingsOpen, setSettingsOpen] = useState(!token);

  useProjectVisualization();

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
              <TooltipTrigger>
                <Link to="/" className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-secondary/70 hover:text-foreground transition-colors duration-150">
                  <TbArrowLeft className="h-3.5 w-3.5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>Back to home</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-1 h-4" />

            <Logo size={20} className="text-ink" />
            <span className="text-xs font-bold text-primary tracking-widest">INFRA</span>
            <span className="text-xs text-muted-foreground tracking-wider">VISUALIZER</span>

            {stats && (
              <>
                <Separator orientation="vertical" className="mx-1 h-4" />
                <span className="text-[10px] text-muted-foreground">
                  {stats.totalResources} resources · {stats.parsedFiles} files
                  {projectCatalog && ` · ${projectCatalog.projects.size} projects`}
                </span>
                {selectedProject && (
                  <span className="text-[10px] font-medium text-primary ml-1">
                    · {selectedProject}
                  </span>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            {stats && errors.length > 0 && (
              <span className="flex items-center gap-1 text-[10px] text-destructive mr-1">
                <TbAlertTriangle className="h-3 w-3" />
                {errors.length}
              </span>
            )}

            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-7 w-7 ${settingsOpen ? 'bg-primary/10 text-primary' : ''}`}
                  onClick={() => setSettingsOpen(!settingsOpen)}
                >
                  <TbSettings className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>GitHub settings</TooltipContent>
            </Tooltip>
            <ThemeToggle />
          </div>
        </div>
      </TooltipProvider>

      {/* GitHub Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>GitHub Connection</DialogTitle>
            <DialogDescription>
              Connect to a repository to scan Terraform infrastructure.
            </DialogDescription>
          </DialogHeader>
          <GitHubSettings onSyncComplete={() => setSettingsOpen(false)} />
        </DialogContent>
      </Dialog>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar: project list */}
        {projectCatalog && (
          <div className="flex w-72 shrink-0 flex-col border-r border-border bg-card">
            <ProjectSidebar />
          </div>
        )}

        {/* Canvas */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {stats ? (
            <>
              <div className="flex-1 overflow-hidden">
                <VisualizerCanvas />
              </div>
              {errors.length > 0 && <BottomPanel />}
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-secondary">
                  <TbTopologyStarRing3 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-sm font-bold text-foreground">Infra Visualizer</h2>
                <p className="max-w-sm text-[11px] leading-relaxed text-muted-foreground">
                  Connect to a GitHub repository to visualize your Terraform
                  infrastructure as an interactive diagram.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSettingsOpen(true)}
                >
                  <TbSettings className="h-3.5 w-3.5" />
                  Connect Repository
                </Button>
              </div>
            </div>
          )}
        </main>

        {/* Right inspector */}
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
