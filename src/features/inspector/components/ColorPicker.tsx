import { memo } from 'react';

import { cn } from '@/shared/lib/utils';

const presetColors = [
  '#FF9900', '#0078D4', '#4285F4', '#E53935',
  '#43A047', '#8E24AA', '#00ACC1', '#F4511E',
  '#3949AB', '#C0CA33', '#6D4C41', '#546E7A',
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const RawColorPicker = ({ value, onChange }: ColorPickerProps) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-7 cursor-pointer rounded-md border border-border bg-transparent"
        />
        <span className="text-[11px] text-muted-foreground font-mono">{value}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {presetColors.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={cn(
              'h-5 w-5 rounded-full border transition-all duration-150',
              value === color ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-border/40 hover:scale-110',
            )}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};

export const ColorPicker = memo(RawColorPicker);
