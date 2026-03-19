import { useState } from 'react';

import { RxPlus, RxTrash } from 'react-icons/rx';

import { Button, Input } from '@/shared/components/ui';

interface MetadataEditorProps {
  metadata: Record<string, string>;
  onChange: (metadata: Record<string, string>) => void;
}

export const MetadataEditor = ({ metadata, onChange }: MetadataEditorProps) => {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const entries = Object.entries(metadata);

  const handleAdd = () => {
    if (!newKey.trim()) return;
    onChange({ ...metadata, [newKey.trim()]: newValue });
    setNewKey('');
    setNewValue('');
  };

  const handleRemove = (key: string) => {
    const next = { ...metadata };
    delete next[key];
    onChange(next);
  };

  const handleUpdate = (key: string, value: string) => {
    onChange({ ...metadata, [key]: value });
  };

  return (
    <div className="space-y-1.5">
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        Metadata
      </span>

      {entries.map(([key, value]) => (
        <div key={key} className="flex items-center gap-1">
          <span className="w-20 truncate text-[10px] text-muted-foreground" title={key}>
            {key}
          </span>
          <Input
            value={value}
            onChange={(e) => handleUpdate(key, e.target.value)}
            className="h-7 flex-1 text-xs"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={() => handleRemove(key)}
          >
            <RxTrash className="h-3 w-3 text-destructive" />
          </Button>
        </div>
      ))}

      <div className="flex items-center gap-1">
        <Input
          placeholder="Key"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          className="h-7 w-20 text-xs"
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Input
          placeholder="Value"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="h-7 flex-1 text-xs"
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={handleAdd}
        >
          <RxPlus className="h-3 w-3 text-primary" />
        </Button>
      </div>
    </div>
  );
};
