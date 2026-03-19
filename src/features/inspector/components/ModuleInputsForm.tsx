import type { ModuleInput } from '@/features/codegen/types';
import {
  Input, Label,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/shared/components/ui';

interface ModuleInputsFormProps {
  inputs: ModuleInput[];
  values: Record<string, unknown>;
  onChange: (name: string, value: unknown) => void;
}

export const ModuleInputsForm = ({ inputs, values, onChange }: ModuleInputsFormProps) => {
  return (
    <div className="space-y-2.5">
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        Terraform Inputs
      </span>

      {inputs.map((input) => (
        <div key={input.name} className="space-y-0.5">
          <Label>
            {input.name}
            {input.required && <span className="ml-0.5 text-destructive">*</span>}
          </Label>
          <p className="text-[10px] text-muted-foreground">{input.description}</p>

          {input.type === 'bool' ? (
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={Boolean(values[input.name] ?? input.default ?? false)}
                onChange={(e) => onChange(input.name, e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-muted-foreground">{values[input.name] ? 'true' : 'false'}</span>
            </label>
          ) : input.options ? (
            <Select
              value={String(values[input.name] ?? input.default ?? '')}
              onValueChange={(v) => onChange(input.name, v)}
            >
              <SelectTrigger className="h-7 text-xs">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {input.options.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : input.type === 'number' ? (
            <Input
              type="number"
              value={String(values[input.name] ?? input.default ?? '')}
              onChange={(e) => onChange(input.name, e.target.value ? Number(e.target.value) : undefined)}
              placeholder={input.default !== undefined ? String(input.default) : ''}
              className="h-7 text-xs"
            />
          ) : input.type === 'list' || input.type === 'map' ? (
            <Input
              value={typeof values[input.name] === 'string'
                ? (values[input.name] as string)
                : JSON.stringify(values[input.name] ?? input.default ?? '')}
              onChange={(e) => {
                try {
                  onChange(input.name, JSON.parse(e.target.value));
                } catch {
                  onChange(input.name, e.target.value);
                }
              }}
              placeholder={input.default !== undefined ? JSON.stringify(input.default) : ''}
              className="h-7 text-xs font-mono"
            />
          ) : (
            <Input
              value={String(values[input.name] ?? input.default ?? '')}
              onChange={(e) => onChange(input.name, e.target.value || undefined)}
              placeholder={input.default !== undefined ? String(input.default) : ''}
              className="h-7 text-xs"
            />
          )}
        </div>
      ))}
    </div>
  );
};
