import { create } from 'zustand';

import type { ExportFormat } from '@/shared/types';

interface UIState {
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  activeTemplate: string | null;
  exportFormat: ExportFormat;
  theme: 'light' | 'dark';
  codePanelOpen: boolean;
  codePanelHeight: number;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  setActiveTemplate: (id: string | null) => void;
  setExportFormat: (format: ExportFormat) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleCodePanel: () => void;
  setCodePanelHeight: (height: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  leftSidebarOpen: true,
  rightSidebarOpen: true,
  activeTemplate: null,
  exportFormat: 'png',
  theme: 'light',
  codePanelOpen: false,
  codePanelHeight: 300,

  toggleLeftSidebar: () => set((s) => ({ leftSidebarOpen: !s.leftSidebarOpen })),
  toggleRightSidebar: () => set((s) => ({ rightSidebarOpen: !s.rightSidebarOpen })),
  setActiveTemplate: (id) => set({ activeTemplate: id }),
  setExportFormat: (format) => set({ exportFormat: format }),
  setTheme: (theme) => set({ theme }),
  toggleCodePanel: () => set((s) => ({ codePanelOpen: !s.codePanelOpen })),
  setCodePanelHeight: (height) => set({ codePanelHeight: height }),
}));
