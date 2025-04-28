import { z } from 'zod';

export const documentCreateSchema = z.object({
  title: z.string().min(1, 'Required'),
  content: z.string(),
});

export const documentUpdateSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  content: z.string().optional(),
});

export const documentDeleteSchema = z.object({
  id: z.number(),
});

// Export types
export type DocumentCreate = z.infer<typeof documentCreateSchema>;
export type DocumentUpdate = z.infer<typeof documentUpdateSchema>;
export type DocumentDelete = z.infer<typeof documentDeleteSchema>;
