import { z } from 'zod';

export const clientCreateSchema = z.object({
  companyName: z.string().min(1, 'Required'),
  contactName: z.string().min(1, 'Required'),
  phone: z.string(),
  email: z.string().email(),
  address: z.string(),
});

export const clientDeleteSchema = z.object({
  id: z.number(),
});

// Export types
export type ClientCreate = z.infer<typeof clientCreateSchema>;
export type ClientDelete = z.infer<typeof clientDeleteSchema>;
