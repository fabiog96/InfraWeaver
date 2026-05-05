import { useState } from 'react';
import { Link } from 'react-router';

import { TbTrash, TbCode, TbSettings, TbArrowLeft, TbUpload } from 'react-icons/tb';

import {
  Button,
  Separator,
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent,
} from '@/shared/components/ui';
import { useDiagramStore, useUIStore } from '@/stores';
import { Logo } from '@/shared/icons/Logo';
import { ExportDialog } from '@/features/export/components';
import { useImport } from '@/features/export/hooks';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { GlobalConfigPanel } from '@/features/codegen/components';

export const TopBar = () => {
  const clearDiagram = useDiagramStore((s) => s.clearDiagram);
  const toggleCodePanel = useUIStore((s) => s.toggleCodePanel);
  const codePanelOpen = useUIStore((s) => s.codePanelOpen);
  const [configOpen, setConfigOpen] = useState(false);
  const { fileInputRef, handleFileChange, triggerImport } = useImport();

  return (
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
          <span className="text-xs font-bold text-primary tracking-widest">
            INFRA
          </span>
          <span className="text-xs text-muted-foreground tracking-wider">
            DESIGNER
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 ${codePanelOpen ? 'bg-primary/10 text-primary' : ''}`}
                onClick={toggleCodePanel}
              >
                <TbCode className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle code preview</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setConfigOpen(true)}
              >
                <TbSettings className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Global configuration</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-4" />

          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={clearDiagram}
              >
                <TbTrash className="h-3.5 w-3.5 text-destructive/70" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear canvas</TooltipContent>
          </Tooltip>

          <ThemeToggle />

          <Separator orientation="vertical" className="mx-1 h-4" />

          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={triggerImport}>
                <TbUpload className="h-3.5 w-3.5" />
                Import
              </Button>
            </TooltipTrigger>
            <TooltipContent>Import diagram from JSON</TooltipContent>
          </Tooltip>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleFileChange}
          />

          <ExportDialog />
        </div>
      </div>

      <GlobalConfigPanel open={configOpen} onOpenChange={setConfigOpen} />
    </TooltipProvider>
  );
};
