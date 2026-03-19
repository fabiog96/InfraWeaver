export const formatHclValue = (value: unknown, type: string): string => {
  if (value === undefined || value === null) return '';
  if (type === 'number') return String(value);
  if (type === 'bool') return value ? 'true' : 'false';
  if (type === 'list' || type === 'map') {
    return typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  }
  return `"${String(value)}"`;
};
