import { create } from 'zustand';

import type { ExportFormat, Theme } from '@/shared/types';

interface UIState {
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  exportFormat: ExportFormat;
  theme: Theme;
  codePanelOpen: boolean;
  codePanelHeight: number;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  setExportFormat: (format: ExportFormat) => void;
  setTheme: (theme: Theme) => void;
  toggleCodePanel: () => void;
  setCodePanelHeight: (height: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  leftSidebarOpen: true,
  rightSidebarOpen: true,
  exportFormat: 'png',
  theme: 'light',
  codePanelOpen: false,
  codePanelHeight: 300,

  toggleLeftSidebar: () => set((s) => ({ leftSidebarOpen: !s.leftSidebarOpen })),
  toggleRightSidebar: () => set((s) => ({ rightSidebarOpen: !s.rightSidebarOpen })),
  setExportFormat: (format) => set({ exportFormat: format }),
  setTheme: (theme) => set({ theme }),
  toggleCodePanel: () => set((s) => ({ codePanelOpen: !s.codePanelOpen })),
  setCodePanelHeight: (height) => set({ codePanelHeight: height }),
}));
