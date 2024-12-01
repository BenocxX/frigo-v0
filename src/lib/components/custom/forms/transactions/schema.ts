import { z } from 'zod';

export const transactionProduct = z.object({
  productId: z.coerce.number(),
  quantity: z.coerce.number(),
});

export const newTransactionSchema = z.object({
  transactionProducts: z.array(transactionProduct).refine((value) => value.some((item) => item), {
    message: 'Vous devez sélectionner au moins un produit',
  }),
});

export type NewTransactionSchema = typeof newTransactionSchema;
