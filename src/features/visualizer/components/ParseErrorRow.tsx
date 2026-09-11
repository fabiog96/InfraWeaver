import { TbFile } from 'react-icons/tb';

import type { ParseError } from '../parser/types';

interface ParseErrorRowProps {
  error: ParseError;
}

/** Renders any value as text, so nothing but a string can reach React as a child. */
const toText = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '';

  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
};

/** One row of the error list: where the error is, what it says, and what to try. */
export const ParseErrorRow = ({ error }: ParseErrorRowProps) => {
  const filePath = toText(error.filePath);
  const message = toText(error.message);
  const snippet = toText(error.snippet);
  const suggestion = toText(error.suggestion);

  return (
    <div className="flex items-start gap-2 rounded-md bg-secondary/30 px-2 py-1.5">
      <TbFile className="h-3 w-3 shrink-0 mt-0.5 text-muted-foreground" />
      <div className="flex flex-col min-w-0">
        <span className="break-all text-[10px] font-mono text-muted-foreground">
          {filePath}
          {error.line ? `:${error.line}` : ''}
        </span>
        <span className="text-[10px] text-foreground">{message}</span>
        {snippet && (
          <pre className="mt-1 text-[9px] text-muted-foreground font-mono whitespace-pre-wrap">
            {snippet}
          </pre>
        )}
        {suggestion && <span className="text-[9px] text-primary mt-0.5">{suggestion}</span>}
      </div>
    </div>
  );
};
