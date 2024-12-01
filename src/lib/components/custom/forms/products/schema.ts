import { z } from 'zod';

export const addProductSchema = z.object({
  name: z.string().min(2).max(50),
  price: z.coerce.number(),
});

export const deleteProductSchema = z.object({
  productId: z.coerce.number(),
});

export type AddProductSchema = typeof addProductSchema;
export type DeleteProductSchema = typeof deleteProductSchema;