import { useState, useCallback, useRef } from 'react';

import { TbAlertTriangle, TbAlertCircle, TbInfoCircle } from 'react-icons/tb';

import { useUIStore } from '@/stores';
import { ScrollArea } from '@/shared/components/ui';
import { useCodeGeneration } from '../hooks/useCodeGeneration';
import type { ValidationMessage } from '../validators/diagram-validator';
import { FileTree } from './FileTree';
import { CodeViewer } from './CodeViewer';

const severityConfig = {
  error: { icon: TbAlertCircle, color: 'text-error', bg: 'bg-error/10' },
  warning: { icon: TbAlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
  info: { icon: TbInfoCircle, color: 'text-accent', bg: 'bg-accent/10' },
};

const ValidationItem = ({ message }: { message: ValidationMessage }) => {
  const config = severityConfig[message.severity];
  const Icon = config.icon;

  return (
    <div className={`flex items-start gap-1.5 rounded-md px-2 py-1 ${config.bg}`}>
      <Icon className={`h-3 w-3 shrink-0 mt-0.5 ${config.color}`} />
      <span className="text-[11px] text-foreground/80">{message.message}</span>
    </div>
  );
};

export const CodePanel = () => {
  const open = useUIStore((s) => s.codePanelOpen);
  const height = useUIStore((s) => s.codePanelHeight);
  const setCodePanelHeight = useUIStore((s) => s.setCodePanelHeight);

  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'code' | 'problems'>('code');
  const resizing = useRef(false);

  const { files, folderTree, validationMessages } = useCodeGeneration();

  const selectedFile = files.find((f) => f.path === selectedFilePath) || null;

  const errorCount = validationMessages.filter((m) => m.severity === 'error').length;
  const warningCount = validationMessages.filter((m) => m.severity === 'warning').length;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      resizing.current = true;

      const startY = e.clientY;
      const startHeight = height;

      const onMouseMove = (moveEvent: MouseEvent) => {
        if (!resizing.current) return;
        const delta = startY - moveEvent.clientY;
        const newHeight = Math.max(150, Math.min(600, startHeight + delta));
        setCodePanelHeight(newHeight);
      };

      const onMouseUp = () => {
        resizing.current = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [height, setCodePanelHeight],
  );

  if (!open) return null;

  return (
    <div
      className="flex flex-col border-t border-border bg-card"
      style={{ height }}
    >
      <div
        className="h-1 cursor-row-resize bg-border/40 transition-colors duration-150 hover:bg-primary/30"
        onMouseDown={handleMouseDown}
      />

      <div className="flex items-center gap-3 border-b border-border/50 px-3">
        <button
          onClick={() => setActiveTab('code')}
          className={`py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors duration-150 ${
            activeTab === 'code' ? 'text-primary border-b border-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Code
        </button>
        <button
          onClick={() => setActiveTab('problems')}
          className={`flex items-center gap-1.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors duration-150 ${
            activeTab === 'problems' ? 'text-primary border-b border-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Problems
          {(errorCount > 0 || warningCount > 0) && (
            <span className="flex items-center gap-1">
              {errorCount > 0 && (
                <span className="rounded-md bg-error/20 px-1 text-[9px] text-error">{errorCount}</span>
              )}
              {warningCount > 0 && (
                <span className="rounded-md bg-warning/20 px-1 text-[9px] text-warning">{warningCount}</span>
              )}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'code' && (
        <div className="flex flex-1 overflow-hidden">
          <div className="w-48 shrink-0 border-r border-border/50 overflow-hidden">
            <ScrollArea className="h-full">
              <FileTree
                tree={folderTree}
                selectedPath={selectedFilePath}
                onSelectFile={setSelectedFilePath}
              />
            </ScrollArea>
          </div>

          <div className="flex-1 overflow-hidden font-mono">
            <CodeViewer
              content={selectedFile?.content ?? null}
              filePath={selectedFilePath}
            />
          </div>
        </div>
      )}

      {activeTab === 'problems' && (
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {validationMessages.length === 0 ? (
              <p className="py-3 text-center text-[11px] text-muted-foreground">
                No problems detected
              </p>
            ) : (
              validationMessages.map((msg, i) => (
                <ValidationItem key={`${msg.severity}-${msg.nodeId || msg.edgeId || ''}-${i}`} message={msg} />
              ))
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
