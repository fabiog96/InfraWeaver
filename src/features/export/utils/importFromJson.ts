import type { DiagramNode, DiagramEdge } from '@/shared/types';

interface DiagramJson {
  version: string;
  exportedAt: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

const isValidDiagramJson = (data: unknown): data is DiagramJson => {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.version === 'string' &&
    Array.isArray(obj.nodes) &&
    Array.isArray(obj.edges)
  );
};

export const importDiagramFromJson = (file: File): Promise<{ nodes: DiagramNode[]; edges: DiagramEdge[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const parsed: unknown = JSON.parse(reader.result as string);

        if (!isValidDiagramJson(parsed)) {
          reject(new Error('Invalid diagram file format'));
          return;
        }

        resolve({ nodes: parsed.nodes, edges: parsed.edges });
      } catch {
        reject(new Error('Failed to parse JSON file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
