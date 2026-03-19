import { useCallback, useState } from 'react';

import { useDiagramStore } from '@/stores';
import type { ExportFormat } from '@/shared/types';
import { exportDiagramToImage } from '../utils/exportToImage';
import { exportDiagramToJson } from '../utils/exportToJson';
import { useCodeGeneration } from '@/features/codegen/hooks/useCodeGeneration';
import { useGlobalConfig } from '@/features/codegen/stores/globalConfigStore';
import { renderGithubActionsYml } from '@/features/codegen/generators/cicd-github-actions';
import { renderGitlabCiYml } from '@/features/codegen/generators/cicd-gitlab';
import { renderReadme } from '@/features/codegen/generators/readme-generator';
import { exportToZip } from '@/features/codegen/utils/export-to-zip';

export const useExport = () => {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nodes = useDiagramStore((s) => s.nodes);
  const edges = useDiagramStore((s) => s.edges);

  const { files, folderTree } = useCodeGeneration();
  const globalConfig = useGlobalConfig();

  const exportDiagram = useCallback(
    async (format: ExportFormat) => {
      setExporting(true);
      setError(null);
      try {
        if (format === 'json') {
          exportDiagramToJson(nodes, edges);
        } else {
          await exportDiagramToImage({ format });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Export failed';
        setError(message);
        console.error('Export failed:', err);
      } finally {
        setExporting(false);
      }
    },
    [nodes, edges],
  );

  const exportTerragruntZip = useCallback(async () => {
    setExporting(true);
    setError(null);
    try {
      const extraFiles: { path: string; content: string }[] = [];

      extraFiles.push({
        path: 'README.md',
        content: renderReadme(globalConfig, nodes, folderTree),
      });

      if (globalConfig.cicdProvider === 'github-actions') {
        extraFiles.push({
          path: '.github/workflows/deploy.yml',
          content: renderGithubActionsYml(globalConfig),
        });
      } else if (globalConfig.cicdProvider === 'gitlab-ci') {
        extraFiles.push({
          path: '.gitlab-ci.yml',
          content: renderGitlabCiYml(globalConfig),
        });
      }

      await exportToZip(files, extraFiles);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'ZIP export failed';
      setError(message);
      console.error('ZIP export failed:', err);
    } finally {
      setExporting(false);
    }
  }, [files, folderTree, nodes, globalConfig]);

  const clearError = useCallback(() => setError(null), []);

  return { exportDiagram, exportTerragruntZip, exporting, error, clearError };
};
