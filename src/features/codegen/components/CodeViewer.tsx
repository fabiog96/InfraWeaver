import { memo, useMemo } from 'react';

interface CodeViewerProps {
  content: string | null;
  filePath: string | null;
}

/* ── HCL / Terraform lightweight syntax highlighter ──────── */

type Token = { text: string; cls: string };

const HCL_KEYWORDS = new Set([
  'resource', 'data', 'module', 'variable', 'output', 'locals',
  'terraform', 'provider', 'backend', 'required_providers',
  'required_version', 'include', 'dependency', 'dependencies',
  'inputs', 'generate', 'remote_state',
]);

const HCL_BUILTINS = new Set(['true', 'false', 'null']);

const tokenizeLine = (line: string): Token[] => {
  const tokens: Token[] = [];
  let pos = 0;

  const push = (text: string, cls: string) => {
    if (text) tokens.push({ text, cls });
  };

  /* full-line comment */
  const trimmed = line.trimStart();
  if (trimmed.startsWith('#') || trimmed.startsWith('//')) {
    push(line, 'text-ink-3 italic');
    return tokens;
  }

  while (pos < line.length) {
    const rest = line.slice(pos);

    /* whitespace */
    const ws = rest.match(/^(\s+)/);
    if (ws) { push(ws[1], ''); pos += ws[1].length; continue; }

    /* inline comment */
    if (rest.startsWith('#') || rest.startsWith('//')) {
      push(rest, 'text-ink-3 italic');
      break;
    }

    /* quoted string */
    if (rest[0] === '"') {
      const end = rest.indexOf('"', 1);
      const str = end === -1 ? rest : rest.slice(0, end + 1);
      push(str, 'text-ok');
      pos += str.length;
      continue;
    }

    /* number */
    const num = rest.match(/^(\d[\d.]*)/);
    if (num) { push(num[1], 'text-warn'); pos += num[1].length; continue; }

    /* word (keyword / builtin / attribute key / identifier) */
    const word = rest.match(/^([a-zA-Z_][\w-]*)/);
    if (word) {
      const w = word[1];
      if (HCL_KEYWORDS.has(w)) {
        push(w, 'text-accent-brand font-bold');
      } else if (HCL_BUILTINS.has(w)) {
        push(w, 'text-warn');
      } else {
        /* check if this is an attribute key (word followed by optional spaces then =) */
        const after = line.slice(pos + w.length).trimStart();
        if (after.startsWith('=')) {
          push(w, 'text-teal');
        } else {
          push(w, 'text-ink');
        }
      }
      pos += w.length;
      continue;
    }

    /* operators / braces */
    if ('{}'.includes(rest[0])) {
      push(rest[0], 'text-ink-3');
      pos += 1;
      continue;
    }

    if (rest[0] === '=') {
      push('=', 'text-ink-4');
      pos += 1;
      continue;
    }

    /* anything else */
    push(rest[0], 'text-ink-2');
    pos += 1;
  }

  return tokens;
};

const isHcl = (path: string) => /\.(tf|hcl)$/.test(path);

const HighlightedLine = ({ line }: { line: string }) => {
  const tokens = useMemo(() => tokenizeLine(line), [line]);
  return (
    <>
      {tokens.map((t, j) => (
        <span key={j} className={t.cls}>{t.text}</span>
      ))}
    </>
  );
};

/* ── Component ───────────────────────────────────────────── */

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
  const highlight = isHcl(filePath);

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
                {highlight
                  ? <span><HighlightedLine line={line} /></span>
                  : <span className="text-foreground/90">{line}</span>
                }
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

export const CodeViewer = memo(RawCodeViewer);
