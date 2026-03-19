import { TbLayoutSidebarRightCollapse, TbLayoutSidebarRightExpand, TbTrash } from 'react-icons/tb';

import { Button, ScrollArea } from '@/shared/components/ui';
import { useDiagramStore, useUIStore } from '@/stores';
import { NodeForm } from './NodeForm';
import { EdgeForm } from './EdgeForm';

export const PropertyPanel = () => {
  const open = useUIStore((s) => s.rightSidebarOpen);
  const toggle = useUIStore((s) => s.toggleRightSidebar);
  const selectedNodeId = useDiagramStore((s) => s.selectedNodeId);
  const selectedEdgeId = useDiagramStore((s) => s.selectedEdgeId);
  const removeNode = useDiagramStore((s) => s.removeNode);
  const removeEdge = useDiagramStore((s) => s.removeEdge);

  if (!open) {
    return (
      <div className="flex flex-col border-l border-border bg-card z-10">
        <Button variant="ghost" size="icon" onClick={toggle} className="m-1 h-7 w-7">
          <TbLayoutSidebarRightExpand className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full w-64 flex-col border-l border-border bg-card z-10">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
          {selectedEdgeId ? 'Edge' : 'Properties'}
        </span>
        <div className="flex items-center gap-0.5">
          {selectedNodeId && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => removeNode(selectedNodeId)}
              title="Delete node"
            >
              <TbTrash className="h-3 w-3 text-destructive/70" />
            </Button>
          )}
          {selectedEdgeId && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => removeEdge(selectedEdgeId)}
              title="Delete edge"
            >
              <TbTrash className="h-3 w-3 text-destructive/70" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={toggle} className="h-6 w-6">
            <TbLayoutSidebarRightCollapse className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {selectedEdgeId ? <EdgeForm /> : <NodeForm />}
      </ScrollArea>
    </div>
  );
};
