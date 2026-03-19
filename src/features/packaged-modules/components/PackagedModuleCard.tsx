import { memo, type DragEvent } from 'react';

import { ServiceIcon } from '@/shared/icons';
import type { PackagedModule } from '../types';

interface PackagedModuleCardProps {
  module: PackagedModule;
}

const RawPackagedModuleCard = ({ module }: PackagedModuleCardProps) => {
  const onDragStart = (event: DragEvent) => {
    event.dataTransfer.setData('application/archdiagram-module', JSON.stringify(module));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="flex cursor-grab items-start gap-2 rounded-md border border-border/40 bg-secondary/30 px-2 py-1.5 transition-colors duration-100 hover:border-primary/20 hover:bg-secondary/60 active:cursor-grabbing"
    >
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <ServiceIcon icon={module.icon} className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0">
        <span className="block truncate text-xs font-medium text-foreground">{module.name}</span>
        <span className="block text-[10px] text-muted-foreground leading-snug">{module.description}</span>
      </div>
    </div>
  );
};

export const PackagedModuleCard = memo(RawPackagedModuleCard);
