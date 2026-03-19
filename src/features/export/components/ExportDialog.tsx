import { TbDownload, TbPhoto, TbJson, TbFolderCode } from 'react-icons/tb';

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger,
  Button,
} from '@/shared/components/ui';
import { useExport } from '../hooks/useExport';

export const ExportDialog = () => {
  const { exportDiagram, exportTerragruntZip, exporting, error, clearError } = useExport();

  return (
    <Dialog onOpenChange={(open) => { if (open) clearError(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <TbDownload className="h-3.5 w-3.5" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>Export Diagram</DialogTitle>
          <DialogDescription>Choose an export format.</DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}

        <div className="grid gap-1.5">
          <Button
            variant="outline"
            className="justify-start gap-2.5"
            onClick={exportTerragruntZip}
            disabled={exporting}
          >
            <TbFolderCode className="h-4 w-4 text-primary" />
            Terragrunt Project (.zip)
          </Button>
          <Button
            variant="outline"
            className="justify-start gap-2.5"
            onClick={() => exportDiagram('png')}
            disabled={exporting}
          >
            <TbPhoto className="h-4 w-4 text-primary" />
            PNG (High Resolution)
          </Button>
          <Button
            variant="outline"
            className="justify-start gap-2.5"
            onClick={() => exportDiagram('jpg')}
            disabled={exporting}
          >
            <TbPhoto className="h-4 w-4 text-warning" />
            JPG (Compressed)
          </Button>
          <Button
            variant="outline"
            className="justify-start gap-2.5"
            onClick={() => exportDiagram('json')}
            disabled={exporting}
          >
            <TbJson className="h-4 w-4 text-accent" />
            JSON (Data Export)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
