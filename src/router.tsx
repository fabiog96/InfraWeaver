import { createBrowserRouter } from 'react-router';

import { DesignerPage, VisualizerPage, DesignerGuidePage, GitHubTokenGuidePage } from '@/pages';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <DesignerPage />,
    },
    {
      path: '/designer',
      element: <DesignerPage />,
    },
    {
      path: '/visualizer',
      element: <VisualizerPage />,
    },
    {
      path: '/guide/designer',
      element: <DesignerGuidePage />,
    },
    {
      path: '/guide/github-token',
      element: <GitHubTokenGuidePage />,
    },
  ],
  { basename: '/InfraWeaver' },
);
