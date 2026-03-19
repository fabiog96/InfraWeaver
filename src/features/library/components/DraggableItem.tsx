import { memo, type DragEvent } from 'react';

import type { ServiceDefinition } from '@/shared/types';
import { ServiceIcon } from '@/shared/icons';

interface DraggableItemProps {
  service: ServiceDefinition;
}

const RawDraggableItem = ({ service }: DraggableItemProps) => {
  const onDragStart = (event: DragEvent) => {
    event.dataTransfer.setData('application/archdiagram', JSON.stringify(service));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="flex cursor-grab items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors duration-100 hover:bg-secondary/70 active:cursor-grabbing"
      title={service.serviceType}
    >
      <div
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
        style={{ backgroundColor: service.defaultColor + '15', color: service.defaultColor }}
      >
        <ServiceIcon icon={service.icon} className="h-3.5 w-3.5" style={{ color: service.defaultColor }} />
      </div>
      <span className="truncate text-foreground">{service.label}</span>
    </div>
  );
};

export const DraggableItem = memo(RawDraggableItem);
