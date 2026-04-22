import { useState } from 'react';
import { TbChevronUp, TbChevronDown, TbAlertTriangle, TbFile } from 'react-icons/tb';

import { cn } from '@/shared/lib/utils';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Badge } from '@/shared/components/ui/badge';
import { useVisualizerStore } from '../stores/visualizerStore';

/**
 * Collapsible bottom panel showing parse/resolve errors.
 * Shows a summary bar when collapsed, full error list when expanded.
 */
export const BottomPanel = () => {
  const errors = useVisualizerStore((s) => s.errors);
  const [expanded, setExpanded] = useState(false);

  if (errors.length === 0) return null;

  const fileErrors = errors.filter((e) => e.level === 'file_error');
  const parseErrors = errors.filter((e) => e.level === 'parse_error');
  const resolveErrors = errors.filter((e) => e.level === 'resolve_error');

  return (
    <div className={cn(
      'border-t border-border bg-card transition-all duration-200',
      expanded ? 'h-48' : 'h-8',
    )}>
      {/* Header bar — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex h-8 w-full items-center gap-2 px-3 text-left hover:bg-secondary/30 transition-colors"
      >
        <TbAlertTriangle className="h-3 w-3 text-destructive" />
        <span className="text-[10px] text-muted-foreground">
          {errors.length} error{errors.length > 1 ? 's' : ''}
        </span>

        <div className="flex items-center gap-1.5 ml-2">
          {fileErrors.length > 0 && (
            <Badge variant="destructive" className="h-4 px-1.5 text-[9px]">
              {fileErrors.length} file
            </Badge>
          )}
          {parseErrors.length > 0 && (
            <Badge variant="warning" className="h-4 px-1.5 text-[9px]">
              {parseErrors.length} parse
            </Badge>
          )}
          {resolveErrors.length > 0 && (
            <Badge variant="secondary" className="h-4 px-1.5 text-[9px]">
              {resolveErrors.length} resolve
            </Badge>
          )}
        </div>

        <div className="ml-auto">
          {expanded ? (
            <TbChevronDown className="h-3 w-3 text-muted-foreground" />
          ) : (
            <TbChevronUp className="h-3 w-3 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Error list — shown when expanded */}
      {expanded && (
        <ScrollArea className="h-40">
          <div className="space-y-1 px-3 pb-2">
            {errors.map((error, i) => (
              <div
                key={`${error.filePath}-${error.line}-${i}`}
                className="flex items-start gap-2 rounded-md bg-secondary/30 px-2 py-1.5"
              >
                <TbFile className="h-3 w-3 shrink-0 mt-0.5 text-muted-foreground" />
                <div className="flex flex-col min-w-0">
                  <span className="break-all text-[10px] font-mono text-muted-foreground">
                    {error.filePath}
                    {error.line ? `:${error.line}` : ''}
                  </span>
                  <span className="text-[10px] text-foreground">{error.message}</span>
                  {error.snippet && (
                    <pre className="mt-1 text-[9px] text-muted-foreground font-mono whitespace-pre-wrap">
                      {error.snippet}
                    </pre>
                  )}
                  {error.suggestion && (
                    <span className="text-[9px] text-primary mt-0.5">{error.suggestion}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
