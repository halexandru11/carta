import { z } from 'zod';

export const templateCreateSchema = z.object({
  title: z.string().min(1, 'Required'),
  content: z.string(),
});

export const templateUpdateSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  content: z.string().optional(),
});

export const templateDeleteSchema = z.object({
  id: z.number(),
});

// Export types
export type TemplateCreate = z.infer<typeof templateCreateSchema>;
export type TemplateUpdate = z.infer<typeof templateUpdateSchema>;
export type TemplateDelete = z.infer<typeof templateDeleteSchema>;
