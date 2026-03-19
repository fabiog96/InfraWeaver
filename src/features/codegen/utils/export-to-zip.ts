import JSZip from 'jszip';

import type { GeneratedFile } from '../hooks/useCodeGeneration';

export const exportToZip = async (
  files: GeneratedFile[],
  extraFiles: { path: string; content: string }[],
): Promise<void> => {
  const zip = new JSZip();

  for (const file of files) {
    zip.file(file.path, file.content);
  }

  for (const file of extraFiles) {
    zip.file(file.path, file.content);
  }

  const blob = await zip.generateAsync({ type: 'blob' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'infrastructure-live.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
