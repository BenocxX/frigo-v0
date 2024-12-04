import { z } from 'zod';

export const deleteSessionSchema = z.object({
  publicId: z.string().min(1),
});

export type DeleteSessionSchema = typeof deleteSessionSchema;
