import { z } from 'zod';

export const updateNamesSchema = z.object({
  username: z.string().min(2).max(50).optional(),
  firstname: z.string().min(2).max(50).optional(),
  lastname: z.string().min(2).max(50).optional(),
});

export type UpdateNamesSchema = typeof updateNamesSchema;
