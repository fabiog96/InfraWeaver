import { useCallback, type DragEvent } from 'react';

import { useReactFlow } from '@xyflow/react';

import type { ServiceDefinition, TechNodeData } from '@/shared/types';
import { useDiagramStore } from '@/stores';
import { getModule } from '@/features/codegen/data/module-registry';

let nodeIdCounter = 0;

export const useDragToCanvas = () => {
  const { screenToFlowPosition } = useReactFlow();
  const addNode = useDiagramStore((s) => s.addNode);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const raw = event.dataTransfer.getData('application/archdiagram');
      if (!raw) return;

      const service: ServiceDefinition = JSON.parse(raw);
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      nodeIdCounter += 1;
      const id = `${service.id}-${Date.now()}-${nodeIdCounter}`;

      const tfModule = getModule(service.id);
      const defaultInputs: Record<string, unknown> = {};
      if (tfModule) {
        for (const input of tfModule.inputs) {
          if (input.default !== undefined) {
            defaultInputs[input.name] = input.default;
          }
        }
      }

      const data: TechNodeData = {
        label: service.label,
        provider: service.provider,
        serviceType: service.serviceType,
        icon: service.icon,
        status: 'none',
        color: service.defaultColor,
        notes: '',
        moduleId: service.id,
        terraformInputs: defaultInputs,
        terraformSecrets: {},
      };

      addNode({
        id,
        type: 'tech' as const,
        position,
        data,
      });
    },
    [screenToFlowPosition, addNode],
  );

  return { onDragOver, onDrop };
};
