import { toPng, toJpeg } from 'html-to-image';

import type { ExportFormat } from '@/shared/types';

interface ExportOptions {
  format: ExportFormat;
  quality?: number;
  pixelRatio?: number;
  filename?: string;
}

const getFlowElement = (): HTMLElement | null => {
  return document.querySelector('.react-flow') as HTMLElement | null;
};

const downloadBlob = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
};

const hideUIElements = () => {
  const selectors = [
    '.react-flow__controls',
    '.react-flow__minimap',
    '.react-flow__attribution',
  ];

  const hidden: { el: HTMLElement; display: string }[] = [];

  for (const selector of selectors) {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (el) {
      hidden.push({ el, display: el.style.display });
      el.style.display = 'none';
    }
  }

  return hidden;
};

const restoreUIElements = (hidden: { el: HTMLElement; display: string }[]) => {
  for (const { el, display } of hidden) {
    el.style.display = display;
  }
};

export const exportDiagramToImage = async (options: ExportOptions) => {
  const {
    format,
    quality = 0.95,
    pixelRatio = Math.max(window.devicePixelRatio, 2),
    filename = `diagram-${Date.now()}`,
  } = options;

  const element = getFlowElement();
  if (!element) {
    throw new Error('React Flow viewport not found');
  }

  const hidden = hideUIElements();

  try {
    const convertFn = format === 'jpg' ? toJpeg : toPng;
    const extension = format === 'jpg' ? 'jpg' : 'png';

    const dataUrl = await convertFn(element, {
      quality,
      pixelRatio,
      filter: (node) => {
        const el = node as HTMLElement;
        return !(
          el.classList?.contains('react-flow__controls') ||
          el.classList?.contains('react-flow__minimap') ||
          el.classList?.contains('react-flow__attribution')
        );
      },
    });

    downloadBlob(dataUrl, `${filename}.${extension}`);
  } finally {
    restoreUIElements(hidden);
  }
};
