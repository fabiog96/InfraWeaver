import { useState } from 'react';

import { TbEye, TbEyeOff } from 'react-icons/tb';

import type { ModuleSecret } from '@/features/codegen/types';
import { Input, Label, Button } from '@/shared/components/ui';

interface SecretsFormProps {
  secrets: ModuleSecret[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

export const SecretsForm = ({ secrets, values, onChange }: SecretsFormProps) => {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const toggleReveal = (name: string) => {
    setRevealed((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="space-y-2.5">
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        Secrets
      </span>

      {secrets.map((secret) => (
        <div key={secret.name} className="space-y-0.5">
          <Label>{secret.name}</Label>
          <p className="text-[10px] text-muted-foreground">
            {secret.description} — source: <span className="font-mono">{secret.source}</span>
          </p>
          <div className="flex items-center gap-1">
            <Input
              type={revealed[secret.name] ? 'text' : 'password'}
              value={values[secret.name] ?? ''}
              onChange={(e) => onChange(secret.name, e.target.value)}
              placeholder={secret.source === 'env' ? 'ENV_VAR_NAME' : 'secret-name'}
              className="h-7 flex-1 text-xs font-mono"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={() => toggleReveal(secret.name)}
            >
              {revealed[secret.name]
                ? <TbEyeOff className="h-3 w-3" />
                : <TbEye className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
