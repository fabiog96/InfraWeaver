import { useCallback } from 'react';

import { useShallow } from 'zustand/shallow';

import { Input, Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Separator } from '@/shared/components/ui';
import { useDiagramStore } from '@/stores';
import type { TechNodeData, NodeStatus } from '@/shared/types';
import { getModule } from '@/features/codegen/data/module-registry';
import { ColorPicker } from './ColorPicker';
import { ModuleInputsForm } from './ModuleInputsForm';
import { SecretsForm } from './SecretsForm';
import { OutputsList } from './OutputsList';

export const NodeForm = () => {
  const selectedNodeId = useDiagramStore((s) => s.selectedNodeId);

  const nodeData = useDiagramStore(
    useShallow((s) => {
      if (!s.selectedNodeId) return null;
      const node = s.nodes.find((n) => n.id === s.selectedNodeId);
      if (!node?.data) return null;
      return node.data as TechNodeData;
    }),
  );

  const updateNodeData = useDiagramStore((s) => s.updateNodeData);

  const handleChange = useCallback(
    (field: keyof TechNodeData, value: unknown) => {
      if (!selectedNodeId) return;
      updateNodeData(selectedNodeId, { [field]: value });
    },
    [selectedNodeId, updateNodeData],
  );

  const handleInputChange = useCallback(
    (name: string, value: unknown) => {
      if (!selectedNodeId || !nodeData) return;
      const updated = { ...nodeData.terraformInputs, [name]: value };
      if (value === undefined) delete updated[name];
      updateNodeData(selectedNodeId, { terraformInputs: updated });
    },
    [selectedNodeId, nodeData, updateNodeData],
  );

  const handleSecretChange = useCallback(
    (name: string, value: string) => {
      if (!selectedNodeId || !nodeData) return;
      updateNodeData(selectedNodeId, {
        terraformSecrets: { ...nodeData.terraformSecrets, [name]: value },
      });
    },
    [selectedNodeId, nodeData, updateNodeData],
  );

  if (!nodeData) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-center text-[11px] text-muted-foreground">
          Select a node to edit its properties
        </p>
      </div>
    );
  }

  const tfModule = getModule(nodeData.moduleId);

  return (
    <div className="space-y-3 p-3">
      <div className="space-y-1">
        <Label>Label</Label>
        <Input
          value={nodeData.label}
          onChange={(e) => handleChange('label', e.target.value)}
          className="h-7 text-xs"
        />
      </div>

      <div className="space-y-1">
        <Label>Service Type</Label>
        <Input
          value={nodeData.serviceType}
          className="h-7 text-xs"
          readOnly
        />
      </div>

      <div className="space-y-1">
        <Label>Provider</Label>
        <Input
          value={nodeData.provider?.toUpperCase()}
          className="h-7 text-xs"
          readOnly
        />
      </div>

      {tfModule && tfModule.inputs.length > 0 && (
        <>
          <Separator />
          <ModuleInputsForm
            inputs={tfModule.inputs}
            values={nodeData.terraformInputs}
            onChange={handleInputChange}
          />
        </>
      )}

      {tfModule && tfModule.secrets.length > 0 && (
        <>
          <Separator />
          <SecretsForm
            secrets={tfModule.secrets}
            values={nodeData.terraformSecrets}
            onChange={handleSecretChange}
          />
        </>
      )}

      {tfModule && tfModule.outputs.length > 0 && (
        <>
          <Separator />
          <OutputsList outputs={tfModule.outputs} />
        </>
      )}

      <Separator />

      <div className="space-y-1">
        <Label>Status</Label>
        <Select
          value={nodeData.status}
          onValueChange={(v) => handleChange('status', v as NodeStatus)}
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="healthy">Healthy</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label>Color</Label>
        <ColorPicker
          value={nodeData.color}
          onChange={(c) => handleChange('color', c)}
        />
      </div>

      <Separator />

      <div className="space-y-1">
        <Label>Notes</Label>
        <textarea
          value={nodeData.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Add notes..."
          className="w-full rounded-md border border-input bg-secondary/30 px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-accent/50 resize-y min-h-[52px]"
          rows={2}
        />
      </div>
    </div>
  );
};
