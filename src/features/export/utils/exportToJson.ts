import type { DiagramNode, DiagramEdge } from '@/shared/types';

interface DiagramJson {
  version: string;
  exportedAt: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export const exportDiagramToJson = (nodes: DiagramNode[], edges: DiagramEdge[]) => {
  const data: DiagramJson = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    nodes,
    edges,
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.download = `diagram-${Date.now()}.json`;
  link.href = url;
  link.click();

  URL.revokeObjectURL(url);
};
