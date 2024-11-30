import { z } from 'zod';

export const passkeyLoginSchema = z.object({
  username: z.string().min(2).max(50),
});

export type PasskeyLoginSchema = typeof passkeyLoginSchema;
