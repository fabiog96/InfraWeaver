import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  Input, Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/shared/components/ui';
import { useGlobalConfigStore, useGlobalConfig } from '../stores/globalConfigStore';

const AWS_REGIONS = [
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-central-1', 'eu-north-1',
  'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ap-northeast-2',
  'ap-south-1', 'sa-east-1',
];

const ENVIRONMENTS = ['dev', 'staging', 'prod'];

interface GlobalConfigPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GlobalConfigPanel = ({ open, onOpenChange }: GlobalConfigPanelProps) => {
  const config = useGlobalConfig();
  const setField = useGlobalConfigStore((s) => s.setField);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Global Configuration</DialogTitle>
          <DialogDescription>
            Terragrunt root configuration for remote state and provider settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-1">
          <div className="space-y-1">
            <Label>AWS Region</Label>
            <Select value={config.region} onValueChange={(v) => setField('region', v)}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AWS_REGIONS.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Environment</Label>
            <Select value={config.environment} onValueChange={(v) => setField('environment', v)}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ENVIRONMENTS.map((e) => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Project Name</Label>
            <Input
              value={config.project}
              onChange={(e) => setField('project', e.target.value)}
              className="h-7 text-xs"
              placeholder="my-project"
            />
          </div>

          <div className="space-y-1">
            <Label>Subproject</Label>
            <Input
              value={config.subproject}
              onChange={(e) => setField('subproject', e.target.value)}
              className="h-7 text-xs"
              placeholder="infra"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-muted-foreground/60">State Bucket (auto)</Label>
            <Input
              value={config.stateBucket}
              onChange={(e) => setField('stateBucket', e.target.value)}
              className="h-7 text-xs text-muted-foreground"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-muted-foreground/60">Lock Table (auto)</Label>
            <Input
              value={config.lockTable}
              onChange={(e) => setField('lockTable', e.target.value)}
              className="h-7 text-xs text-muted-foreground"
            />
          </div>

          <div className="space-y-1">
            <Label>CI/CD Provider</Label>
            <Select value={config.cicdProvider} onValueChange={(v) => setField('cicdProvider', v)}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="github-actions">GitHub Actions</SelectItem>
                <SelectItem value="gitlab-ci">GitLab CI</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
