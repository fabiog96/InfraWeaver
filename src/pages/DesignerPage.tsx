import { ReactFlowProvider } from '@xyflow/react';

import { TopBar, Canvas } from '@/features/editor/components';
import { LibrarySidebar } from '@/features/library/components';
import { PropertyPanel } from '@/features/inspector/components';
import { CodePanel } from '@/features/codegen/components';
import { useCanvasActions } from '@/features/editor/hooks';
import { useThemeSync } from '@/shared/hooks';

const DesignerLayout = () => {
  useCanvasActions();
  useThemeSync();

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LibrarySidebar />
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <Canvas />
          </div>
          <CodePanel />
        </main>
        <PropertyPanel />
      </div>
    </div>
  );
};

export const DesignerPage = () => {
  return (
    <ReactFlowProvider>
      <DesignerLayout />
    </ReactFlowProvider>
  );
};
