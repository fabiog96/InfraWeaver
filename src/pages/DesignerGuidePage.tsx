import { useEffect } from 'react';
import { Link } from 'react-router';
import {
  TbArrowLeft, TbMouse, TbKeyboard, TbClick,
  TbArrowsMove, TbTrash, TbCopy, TbClipboard,
  TbZoomIn, TbZoomOut, TbArrowBack,
  TbPlugConnected, TbBoxMultiple, TbDownload, TbUpload,
} from 'react-icons/tb';

import { useUIStore } from '@/stores';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { Logo } from '@/shared/icons/Logo';

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-semibold text-foreground">
    {children}
  </kbd>
);

const SHORTCUTS = [
  { keys: ['Delete', 'Backspace'], action: 'Delete selected node', icon: TbTrash },
  { keys: ['Ctrl/Cmd', 'C'], action: 'Copy selected node', icon: TbCopy },
  { keys: ['Ctrl/Cmd', 'V'], action: 'Paste copied node', icon: TbClipboard },
  { keys: ['Shift', 'Click'], action: 'Add node to selection', icon: TbClick },
  { keys: ['Scroll'], action: 'Zoom in / out', icon: TbZoomIn },
  { keys: ['Escape'], action: 'Close dialog / dropdown', icon: TbArrowBack },
];

const SECTIONS = [
  {
    number: '01',
    title: 'Adding services to the canvas',
    icon: TbMouse,
    content: (
      <>
        Open the <strong>Library</strong> sidebar on the left. Browse services by category using the tabs
        (<strong>AWS</strong>, <strong>Generic</strong>, <strong>Modules</strong>) or type in the search bar.
        <strong> Drag</strong> any service from the list and <strong>drop</strong> it onto the canvas.
        The node appears with the official AWS icon and category color.
      </>
    ),
  },
  {
    number: '02',
    title: 'Navigating the canvas',
    icon: TbArrowsMove,
    content: (
      <>
        <strong>Drag on empty space</strong> to pan around.
        Use the <strong>scroll wheel</strong> to zoom in and out.
        The <strong>minimap</strong> in the bottom-right corner shows an overview of your diagram.
        Use the <strong>controls</strong> in the bottom-left to zoom to fit or reset the view.
      </>
    ),
  },
  {
    number: '03',
    title: 'Connecting nodes',
    icon: TbPlugConnected,
    content: (
      <>
        Hover over a node to reveal the <strong>connection handles</strong> (small dots on each side).
        <strong> Drag from any handle</strong> to another node's handle to create an edge.
        Edges show an arrow indicating the flow direction.
        You can connect from any side to any side — choose the shortest path to avoid crossing lines.
      </>
    ),
  },
  {
    number: '04',
    title: 'Editing properties',
    icon: TbKeyboard,
    content: (
      <>
        <strong>Click a node</strong> to select it. The <strong>Properties</strong> panel on the right
        shows its label, status, color, Terraform inputs, secrets, and notes.
        <strong> Click an edge</strong> to edit its label, line style (solid / dashed / dotted),
        and <strong>Output Mappings</strong> — which wire Terraform outputs from the source
        to inputs on the target.
      </>
    ),
  },
  {
    number: '05',
    title: 'Using groups',
    icon: TbBoxMultiple,
    content: (
      <>
        Drag a <strong>Group</strong> from the Generic tab onto the canvas to create a container.
        Then drag nodes <strong>on top of the group</strong> — they snap inside and move together.
        Groups are useful to represent VPCs, environments, or logical boundaries.
        You can resize a group by dragging its edges when selected.
      </>
    ),
  },
  {
    number: '06',
    title: 'Packaged Modules',
    icon: TbZoomOut,
    content: (
      <>
        Switch to the <strong>Modules</strong> tab in the library sidebar.
        These are <strong>pre-built architectures</strong> (e.g. Serverless API, ECS Microservice)
        that drop multiple connected nodes at once inside an optional group.
        Drag a module card onto the canvas to instantly scaffold a common pattern.
      </>
    ),
  },
  {
    number: '07',
    title: 'Import and Export',
    icon: TbDownload,
    content: (
      <>
        Use the top bar buttons to <strong>Import</strong> a diagram from JSON or
        <strong> Export</strong> it as PNG, JPG, JSON, or a full <strong>Terragrunt project (.zip)</strong>.
        The code preview panel (toggle with the code icon) shows the generated Terraform in real time.
      </>
    ),
  },
];

export const DesignerGuidePage = () => {
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="flex h-screen w-screen flex-col bg-background overflow-y-auto">
      <div className="sticky top-0 z-10 flex h-10 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link to="/designer" className="text-muted-foreground hover:text-foreground transition-colors">
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

      <div className="mx-auto w-full max-w-2xl px-6 py-12">
        <h1 className="text-lg font-bold text-foreground tracking-wide">
          Designer Guide
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Everything you need to know to design cloud architectures, connect services,
          and generate Terraform code with the Designer.
        </p>

        <div className="mt-10 flex flex-col">
          {SECTIONS.map((section) => (
            <div key={section.number} className="grid grid-cols-[48px_1fr] gap-4 border-t border-border py-6">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-semibold tracking-widest text-muted-foreground">
                  {section.number}
                </span>
                <section.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">{section.title}</h2>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {section.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-md border border-border bg-card">
          <div className="border-b border-border px-4 py-2.5">
            <h3 className="text-[10px] font-semibold tracking-widest text-muted-foreground">
              KEYBOARD SHORTCUTS
            </h3>
          </div>
          <div className="divide-y divide-border">
            {SHORTCUTS.map((shortcut) => (
              <div key={shortcut.action} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <shortcut.icon className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[11px] text-foreground">{shortcut.action}</span>
                </div>
                <div className="flex items-center gap-1">
                  {shortcut.keys.map((key, i) => (
                    <span key={key} className="flex items-center gap-1">
                      {i > 0 && <span className="text-[10px] text-muted-foreground">+</span>}
                      <Kbd>{key}</Kbd>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-md border border-primary/20 bg-primary/5 px-4 py-3">
          <p className="text-[11px] leading-relaxed text-foreground">
            <strong>Tip:</strong> Use the <strong>Global Configuration</strong> panel (gear icon in the top bar)
            to set your AWS region, environment, and project name. These values are injected into
            every generated Terraform module automatically.
          </p>
        </div>

        <div className="mt-10 flex items-center gap-3">
          <Link
            to="/designer"
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2.5 text-xs font-semibold text-background transition-transform hover:-translate-y-px"
          >
            Open Designer
          </Link>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-xs text-foreground transition-colors hover:border-foreground"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
