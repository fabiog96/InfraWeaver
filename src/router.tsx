import { createBrowserRouter } from 'react-router';

import { LandingPage } from '@/pages/LandingPage';
import { DesignerPage } from '@/pages/DesignerPage';
import { VisualizerPage } from '@/pages/VisualizerPage';

export const router = createBrowserRouter(
  [
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/designer',
    element: <DesignerPage />,
  },
  {
    path: '/visualizer',
    element: <VisualizerPage />,
  },
],
  { basename: '/diagrammer-farm' },
);
