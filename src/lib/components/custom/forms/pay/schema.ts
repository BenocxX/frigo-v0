import { z } from 'zod';

export const paySchema = z.object({
  paymentMethod: z.enum(['interac', 'shakepay', 'bitcoin', 'ethereum']),
});

export type PaySchema = typeof paySchema;
