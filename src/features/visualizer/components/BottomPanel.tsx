import { useState } from 'react';
import { TbChevronUp, TbChevronDown, TbAlertTriangle } from 'react-icons/tb';

import { cn } from '@/shared/lib/utils';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Badge } from '@/shared/components/ui/badge';
import { useVisualizerStore } from '../stores/visualizerStore';
import { ParseErrorRow } from './ParseErrorRow';

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
              <ParseErrorRow key={`${error.filePath}-${error.line}-${i}`} error={error} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
