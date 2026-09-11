import { useState, useCallback } from 'react';
import { Link } from 'react-router';
import { TbArrowLeft, TbExternalLink, TbCopy, TbCheck } from 'react-icons/tb';

import { useThemeSync } from '@/shared/hooks';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { Logo } from '@/shared/icons/Logo';

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-semibold text-foreground">
    {children}
  </kbd>
);

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="rounded bg-card px-1.5 py-0.5 text-[11px] text-primary">
    {children}
  </code>
);

const SCOPES = [
  { name: 'repo', description: 'Full control of private repositories (read access to code, commits, branches)' },
  { name: 'read:org', description: 'Read organization membership (optional — only for org-owned repos)' },
];

const STEPS = [
  {
    number: '01',
    title: 'Open GitHub token settings',
    content: (
      <>
        Go to{' '}
        <a
          href="https://github.com/settings/tokens"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary underline underline-offset-2 hover:text-accent-brand"
        >
          github.com/settings/tokens
          <TbExternalLink className="h-3 w-3" />
        </a>
        {' '}and click <Kbd>Generate new token (classic)</Kbd>.
      </>
    ),
  },
  {
    number: '02',
    title: 'Name and expiration',
    content: (
      <>
        Give your token a recognizable name like <Code>infraweaver-visualizer</Code>.
        Set an expiration that works for you — 90 days is a good default.
      </>
    ),
  },
  {
    number: '03',
    title: 'Select scopes',
    content: (
      <>
        InfraWeaver only reads your repo contents. Select the minimum scopes listed below.
      </>
    ),
  },
  {
    number: '04',
    title: 'Generate and copy',
    content: (
      <>
        Click <Kbd>Generate token</Kbd>, then copy it immediately — GitHub will not show it again.
        Paste it into the Visualizer's <strong>Personal Access Token</strong> field.
      </>
    ),
  },
];

export const GitHubTokenGuidePage = () => {
  useThemeSync();

  return (
    <div className="flex h-screen w-screen flex-col bg-background overflow-y-auto">
      {/* TOP BAR */}
      <div className="sticky top-0 z-10 flex h-10 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link to="/visualizer" className="text-muted-foreground hover:text-foreground transition-colors">
            <TbArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Logo size={16} className="text-ink" />
            <span className="text-xs font-bold text-primary tracking-widest">INFRA</span>
            <span className="text-xs text-muted-foreground tracking-wider">GUIDE</span>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* CONTENT */}
      <div className="mx-auto w-full max-w-2xl px-6 py-12">
        <h1 className="text-lg font-bold text-foreground tracking-wide">
          Create a GitHub Personal Access Token
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          The Visualizer needs a read-only token to fetch your Terraform files from GitHub.
          Your token stays in this browser tab — it is never sent to any server.
        </p>

        {/* STEPS */}
        <div className="mt-10 flex flex-col">
          {STEPS.map((step) => (
            <div key={step.number} className="grid grid-cols-[48px_1fr] gap-4 border-t border-border py-6">
              <span className="text-[10px] font-semibold tracking-widest text-muted-foreground">
                {step.number}
              </span>
              <div>
                <h2 className="text-sm font-bold text-foreground">{step.title}</h2>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {step.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* SCOPES TABLE */}
        <div className="mt-4 rounded-md border border-border bg-card">
          <div className="border-b border-border px-4 py-2.5">
            <h3 className="text-[10px] font-semibold tracking-widest text-muted-foreground">
              REQUIRED SCOPES (CLASSIC TOKEN)
            </h3>
          </div>
          <div className="divide-y divide-border">
            {SCOPES.map((scope) => (
              <div key={scope.name} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <ScopeChip name={scope.name} />
                  <span className="text-[11px] text-muted-foreground">{scope.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECURITY NOTE */}
        <div className="mt-8 rounded-md border border-primary/20 bg-primary/5 px-4 py-3">
          <p className="text-[11px] leading-relaxed text-foreground">
            <strong>Security note:</strong> InfraWeaver runs entirely in your browser. Your token is stored
            only in sessionStorage, scoped to this tab, and is used exclusively for GitHub API
            calls from your machine. It does not follow you across sessions: closing the tab
            discards it, and a new tab will ask for it again. We recommend revoking the token when
            you no longer need it.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-10 flex items-center gap-3">
          <Link
            to="/visualizer"
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2.5 text-xs font-semibold text-background transition-transform hover:-translate-y-px"
          >
            Open Visualizer
          </Link>
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-xs text-foreground transition-colors hover:border-foreground"
          >
            Go to GitHub Settings
            <TbExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

const ScopeChip = ({ name }: { name: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [name]);

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded border border-border bg-background px-2 py-0.5 text-[11px] font-semibold text-primary transition-colors hover:border-primary/50"
    >
      {copied ? <TbCheck className="h-3 w-3 text-success" /> : <TbCopy className="h-3 w-3" />}
      {name}
    </button>
  );
};
