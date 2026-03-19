import { useDeferredValue, useMemo } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui';
import type { ServiceDefinition } from '@/shared/types';
import { serviceCategories } from '@/features/library/data';
import { DraggableItem } from './DraggableItem';

interface CategoryAccordionProps {
  services: ServiceDefinition[];
  searchQuery: string;
}

export const CategoryAccordion = ({ services, searchQuery }: CategoryAccordionProps) => {
  const deferredQuery = useDeferredValue(searchQuery);

  const filtered = useMemo(() => {
    if (!deferredQuery) return services;
    const q = deferredQuery.toLowerCase();
    return services.filter(
      (s) =>
        s.label.toLowerCase().includes(q) ||
        s.serviceType.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q),
    );
  }, [services, deferredQuery]);

  const grouped = useMemo(() => {
    const map = new Map<string, ServiceDefinition[]>();
    for (const service of filtered) {
      const list = map.get(service.category) || [];
      list.push(service);
      map.set(service.category, list);
    }
    return map;
  }, [filtered]);

  if (grouped.size === 0) {
    return (
      <p className="px-3 py-3 text-[11px] text-muted-foreground">No services found.</p>
    );
  }

  return (
    <Accordion type="multiple" defaultValue={Array.from(grouped.keys())}>
      {Array.from(grouped.entries()).map(([category, items]) => (
        <AccordionItem key={category} value={category}>
          <AccordionTrigger className="px-3 text-[10px] uppercase tracking-wider text-muted-foreground">
            {serviceCategories[category] || category}
            <span className="ml-auto mr-2 text-[10px] text-muted-foreground/50">
              {items.length}
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-1">
            <div className="flex flex-col gap-0.5">
              {items.map((service) => (
                <DraggableItem key={service.id} service={service} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
