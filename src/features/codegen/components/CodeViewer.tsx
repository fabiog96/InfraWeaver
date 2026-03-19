import { memo } from 'react';

interface CodeViewerProps {
  content: string | null;
  filePath: string | null;
}

const RawCodeViewer = ({ content, filePath }: CodeViewerProps) => {
  if (!filePath || content === null) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-[11px] text-muted-foreground">Select a file to preview</p>
      </div>
    );
  }

  const fileName = filePath.split('/').pop() || '';
  const lines = content.split('\n');

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center border-b border-border/50 px-3 py-1">
        <span className="text-[11px] font-medium text-foreground">{fileName}</span>
        <span className="ml-2 text-[10px] text-muted-foreground truncate">{filePath}</span>
      </div>
      <div className="flex-1 overflow-auto">
        <pre className="p-2 text-[11px] leading-relaxed">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="mr-3 inline-block w-6 select-none text-right text-muted-foreground/40">
                  {i + 1}
                </span>
                <span className="text-foreground/90">{line}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

export const CodeViewer = memo(RawCodeViewer);
