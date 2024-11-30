import { z } from 'zod';

export const addProductSchema = z.object({
  name: z.string().min(2).max(50),
  price: z.coerce.number(),
});

export type AddProductSchema = typeof addProductSchema;
