import { z } from 'zod';

export const nodeDataSchema = z.object({
  label: z.string().min(1, 'Label is required').max(50),
  provider: z.enum(['aws', 'generic']),
  serviceType: z.string().min(1),
  icon: z.string().min(1),
  status: z.enum(['healthy', 'warning', 'error', 'none']),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  notes: z.string(),
  moduleId: z.string(),
  terraformInputs: z.record(z.string(), z.unknown()),
  terraformSecrets: z.record(z.string(), z.string()),
});

export type NodeDataFormValues = z.infer<typeof nodeDataSchema>;
