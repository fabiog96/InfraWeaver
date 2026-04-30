import { useCallback, useRef, useState } from 'react';

import { useDiagramStore } from '@/stores';
import { importDiagramFromJson } from '../utils/importFromJson';

export const useImport = () => {
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const setNodes = useDiagramStore((s) => s.setNodes);
  const setEdges = useDiagramStore((s) => s.setEdges);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setImporting(true);
      setError(null);

      try {
        const { nodes, edges } = await importDiagramFromJson(file);
        setNodes(nodes);
        setEdges(edges);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Import failed';
        setError(message);
        console.error('Import failed:', err);
      } finally {
        setImporting(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [setNodes, setEdges],
  );

  const triggerImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { fileInputRef, handleFileChange, triggerImport, importing, error, clearError };
};
