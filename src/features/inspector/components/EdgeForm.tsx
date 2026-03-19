import { useCallback } from 'react';

import { useShallow } from 'zustand/shallow';
import { TbPlus, TbTrash } from 'react-icons/tb';

import {
  Input, Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  Separator, Button,
} from '@/shared/components/ui';
import { useDiagramStore } from '@/stores';
import type { EdgeData, LineStyle, TechNodeData, OutputMapping } from '@/shared/types';
import { getModule } from '@/features/codegen/data/module-registry';

export const EdgeForm = () => {
  const selectedEdgeId = useDiagramStore((s) => s.selectedEdgeId);

  const edgeData = useDiagramStore(
    useShallow((s) => {
      if (!s.selectedEdgeId) return null;
      const edge = s.edges.find((e) => e.id === s.selectedEdgeId);
      if (!edge) return null;
      return (edge.data as EdgeData) || {};
    }),
  );

  const { sourceModule, targetModule } = useDiagramStore(
    useShallow((s) => {
      if (!s.selectedEdgeId) return { sourceModule: null, targetModule: null };
      const edge = s.edges.find((e) => e.id === s.selectedEdgeId);
      if (!edge) return { sourceModule: null, targetModule: null };

      const sourceNode = s.nodes.find((n) => n.id === edge.source);
      const targetNode = s.nodes.find((n) => n.id === edge.target);

      const srcData = sourceNode?.data as TechNodeData | undefined;
      const tgtData = targetNode?.data as TechNodeData | undefined;

      return {
        sourceModule: srcData?.moduleId ? getModule(srcData.moduleId) : null,
        targetModule: tgtData?.moduleId ? getModule(tgtData.moduleId) : null,
      };
    }),
  );

  const updateEdgeData = useDiagramStore((s) => s.updateEdgeData);

  const handleChange = useCallback(
    (field: keyof EdgeData, value: unknown) => {
      if (!selectedEdgeId) return;
      updateEdgeData(selectedEdgeId, { [field]: value });
    },
    [selectedEdgeId, updateEdgeData],
  );

  const handleAddMapping = useCallback(() => {
    if (!selectedEdgeId || !sourceModule || !targetModule) return;
    const current = (edgeData?.outputMapping || []) as OutputMapping[];
    const firstOutput = sourceModule.outputs[0]?.name || '';
    const firstInput = targetModule.inputs[0]?.name || '';
    updateEdgeData(selectedEdgeId, {
      outputMapping: [...current, { sourceOutput: firstOutput, targetInput: firstInput }],
    });
  }, [selectedEdgeId, edgeData, sourceModule, targetModule, updateEdgeData]);

  const handleUpdateMapping = useCallback(
    (index: number, field: keyof OutputMapping, value: string) => {
      if (!selectedEdgeId) return;
      const current = [...((edgeData?.outputMapping || []) as OutputMapping[])];
      current[index] = { ...current[index], [field]: value };
      updateEdgeData(selectedEdgeId, { outputMapping: current });
    },
    [selectedEdgeId, edgeData, updateEdgeData],
  );

  const handleRemoveMapping = useCallback(
    (index: number) => {
      if (!selectedEdgeId) return;
      const current = [...((edgeData?.outputMapping || []) as OutputMapping[])];
      current.splice(index, 1);
      updateEdgeData(selectedEdgeId, { outputMapping: current });
    },
    [selectedEdgeId, edgeData, updateEdgeData],
  );

  if (!edgeData) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-center text-[11px] text-muted-foreground">
          Select a connection to edit
        </p>
      </div>
    );
  }

  const mappings = (edgeData.outputMapping || []) as OutputMapping[];
  const canMapOutputs = sourceModule && targetModule;

  return (
    <div className="space-y-3 p-3">
      <div className="space-y-1">
        <Label>Connection Label</Label>
        <Input
          value={edgeData.label || ''}
          onChange={(e) => handleChange('label', e.target.value)}
          placeholder="e.g. HTTPS, Async"
          className="h-7 text-xs"
        />
      </div>

      <div className="space-y-1">
        <Label>Line Style</Label>
        <Select
          value={edgeData.lineStyle || 'solid'}
          onValueChange={(v) => handleChange('lineStyle', v as LineStyle)}
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Solid</SelectItem>
            <SelectItem value="dashed">Dashed</SelectItem>
            <SelectItem value="dotted">Dotted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {canMapOutputs && (
        <>
          <Separator />
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Output Mappings</Label>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={handleAddMapping}
              >
                <TbPlus className="h-3 w-3" />
              </Button>
            </div>

            {mappings.length === 0 && (
              <p className="text-[10px] text-muted-foreground">
                No mappings. Add one to wire source outputs to target inputs.
              </p>
            )}

            {mappings.map((mapping, i) => (
              <div key={i} className="flex items-center gap-1">
                <Select
                  value={mapping.sourceOutput}
                  onValueChange={(v) => handleUpdateMapping(i, 'sourceOutput', v)}
                >
                  <SelectTrigger className="h-7 text-[10px] flex-1">
                    <SelectValue placeholder="Output" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceModule.outputs.map((o) => (
                      <SelectItem key={o.name} value={o.name}>{o.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <span className="text-[10px] text-muted-foreground shrink-0">&rarr;</span>

                <Select
                  value={mapping.targetInput}
                  onValueChange={(v) => handleUpdateMapping(i, 'targetInput', v)}
                >
                  <SelectTrigger className="h-7 text-[10px] flex-1">
                    <SelectValue placeholder="Input" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetModule.inputs.map((inp) => (
                      <SelectItem key={inp.name} value={inp.name}>{inp.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 shrink-0"
                  onClick={() => handleRemoveMapping(i)}
                >
                  <TbTrash className="h-2.5 w-2.5 text-destructive/70" />
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
