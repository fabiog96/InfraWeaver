import { useCallback, useRef, type DragEvent } from 'react';

import { useReactFlow } from '@xyflow/react';

import type { TechNodeData, GroupNodeData, DiagramEdge } from '@/shared/types';
import { useDiagramStore } from '@/stores';
import { getModule } from '@/features/codegen/data/module-registry';
import { awsServices } from '@/features/library/data';
import type { PackagedModule } from '../types';

export const usePackagedModuleDrop = () => {
  const dropCounter = useRef(0);
  const { screenToFlowPosition } = useReactFlow();
  const addNode = useDiagramStore((s) => s.addNode);
  const setEdges = useDiagramStore((s) => s.setEdges);
  const edges = useDiagramStore((s) => s.edges);

  const dropModule = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const raw = event.dataTransfer.getData('application/archdiagram-module');
      if (!raw) return;

      const pkg: PackagedModule = JSON.parse(raw);
      const dropPosition = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      dropCounter.current += 1;
      const prefix = `pkg-${pkg.id}-${Date.now()}-${dropCounter.current}`;
      const idMap: Record<string, string> = {};

      let groupId: string | undefined;

      if (pkg.group) {
        groupId = `${prefix}-group`;
        const groupData: GroupNodeData = {
          label: pkg.group.label,
          color: '#6366f1',
          folderName: pkg.group.folderName,
        };

        addNode({
          id: groupId,
          type: 'group' as const,
          position: { x: dropPosition.x - 50, y: dropPosition.y - 50 },
          data: groupData,
          style: { width: 500, height: 500 },
        });
      }

      for (const pkgNode of pkg.nodes) {
        const nodeId = `${prefix}-${pkgNode.relativeId}`;
        idMap[pkgNode.relativeId] = nodeId;

        const service = awsServices.find((s) => s.id === pkgNode.serviceId);
        if (!service) continue;

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
          label: pkgNode.label,
          provider: service.provider,
          serviceType: service.serviceType,
          icon: service.icon,
          status: 'none',
          color: service.defaultColor,
          notes: '',
          moduleId: service.id,
          terraformInputs: { ...defaultInputs, ...pkgNode.terraformInputs },
          terraformSecrets: {},
        };

        addNode({
          id: nodeId,
          type: 'tech' as const,
          position: {
            x: pkgNode.position.x + (groupId ? 50 : dropPosition.x),
            y: pkgNode.position.y + (groupId ? 50 : dropPosition.y),
          },
          data,
          parentId: groupId,
          extent: groupId ? 'parent' as const : undefined,
        });
      }

      const newEdges: DiagramEdge[] = pkg.edges
        .filter((e) => idMap[e.sourceRelativeId] && idMap[e.targetRelativeId])
        .map((e) => ({
          id: `${prefix}-edge-${e.sourceRelativeId}-${e.targetRelativeId}`,
          source: idMap[e.sourceRelativeId],
          target: idMap[e.targetRelativeId],
          type: 'smart' as const,
          animated: true,
          data: { label: e.label, lineStyle: 'solid' as const },
        }));

      setEdges([...edges, ...newEdges]);
    },
    [screenToFlowPosition, addNode, setEdges, edges],
  );

  return { dropModule };
};
