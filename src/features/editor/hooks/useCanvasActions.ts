import { useCallback, useEffect } from 'react';

import { useDiagramStore } from '@/stores';

export const useCanvasActions = () => {
  const removeNode = useDiagramStore((s) => s.removeNode);
  const selectedNodeId = useDiagramStore((s) => s.selectedNodeId);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const target = event.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

        if (selectedNodeId) {
          removeNode(selectedNodeId);
        }
      }
    },
    [selectedNodeId, removeNode],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};
