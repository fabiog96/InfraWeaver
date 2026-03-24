import { useMemo } from 'react';
import { TbFile, TbArrowsRight, TbArrowsLeft } from 'react-icons/tb';

import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Separator } from '@/shared/components/ui/separator';
import { useVisualizerStore } from '../stores/visualizerStore';
import { CompositeIcon } from './CompositeIcon';

/**
 * Read-only inspector panel for the Visualizer (D5).
 * Shows details of the selected node: name, type, provider, file path,
 * inbound/outbound dependencies, and source code location.
 * All fields are display-only — no editing.
 */
export const VisualizerInspector = () => {
  const selectedNodeId = useVisualizerStore((s) => s.selectedNodeId);
  const flowNodes = useVisualizerStore((s) => s.flowNodes);
  const graphEdges = useVisualizerStore((s) => s.graphEdges);

  const selectedNode = useMemo(
    () => flowNodes.find((n) => n.id === selectedNodeId),
    [flowNodes, selectedNodeId],
  );

  const { inbound, outbound } = useMemo(() => {
    if (!selectedNodeId) return { inbound: [], outbound: [] };
    return {
      inbound: graphEdges.filter((e) => e.target === selectedNodeId),
      outbound: graphEdges.filter((e) => e.source === selectedNodeId),
    };
  }, [graphEdges, selectedNodeId]);

  if (!selectedNode) {
    return (
      <div className="flex w-64 flex-col border-l border-border bg-card">
        <div className="p-3 text-xs text-muted-foreground">
          Select a node to inspect
        </div>
      </div>
    );
  }

  const data = selectedNode.data as Record<string, unknown>;
  const icons = data.icons as string[];
  const color = data.color as string;

  return (
    <div className="flex w-64 flex-col border-l border-border bg-card">
      <div className="border-b border-border p-3">
        <div className="flex items-center gap-2">
          <div
            className="flex shrink-0 items-center justify-center rounded-md"
            style={{
              backgroundColor: color + '18',
              width: icons.length > 1 ? 'auto' : 32,
              height: 32,
              padding: icons.length > 1 ? '0 6px' : 0,
            }}
          >
            <CompositeIcon icons={icons} color={color} />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-xs font-bold text-foreground">
              {data.label as string}
            </span>
            <span className="truncate text-[10px] text-muted-foreground">
              {data.serviceType as string}
            </span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-3 p-3">
          <Section title="Info">
            <InfoRow label="Type" value={String(data.nodeType)} />
            <InfoRow label="Provider" value={String(data.provider)} />
            {typeof data.layer === 'string' && <InfoRow label="Layer" value={data.layer} />}
            {typeof data.project === 'string' && <InfoRow label="Project" value={data.project} />}
            {typeof data.moduleSource === 'string' && <InfoRow label="Module" value={data.moduleSource} />}
          </Section>

          <Separator />

          <Section title="Source">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <TbFile className="h-3 w-3 shrink-0" />
              <span className="truncate font-mono">{String(data.filePath)}</span>
            </div>
            {typeof data.lineStart === 'number' && (
              <span className="text-[10px] text-muted-foreground">
                Line {data.lineStart}
              </span>
            )}
          </Section>

          {inbound.length > 0 && (
            <>
              <Separator />
              <Section title={`Inbound (${inbound.length})`}>
                {inbound.map((edge) => (
                  <DepRow key={edge.id} icon={<TbArrowsLeft className="h-3 w-3 text-accent" />} nodeId={edge.source} label={edge.label} />
                ))}
              </Section>
            </>
          )}

          {outbound.length > 0 && (
            <>
              <Separator />
              <Section title={`Outbound (${outbound.length})`}>
                {outbound.map((edge) => (
                  <DepRow key={edge.id} icon={<TbArrowsRight className="h-3 w-3 text-primary" />} nodeId={edge.target} label={edge.label} />
                ))}
              </Section>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
      {title}
    </span>
    {children}
  </div>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-[10px] text-muted-foreground">{label}</span>
    <span className="text-[10px] font-medium text-foreground">{value}</span>
  </div>
);

const DepRow = ({ icon, nodeId, label }: { icon: React.ReactNode; nodeId: string; label: string }) => {
  const shortId = nodeId.split('.').slice(-1)[0] ?? nodeId;
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="truncate text-[10px] text-foreground">{shortId}</span>
      {label && (
        <span className="ml-auto text-[9px] text-muted-foreground">.{label}</span>
      )}
    </div>
  );
};
