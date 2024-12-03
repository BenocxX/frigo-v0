import { z } from 'zod';

export const passkeyLoginSchema = z.object({
  username: z.string().min(2).max(50),
});

export const deletePasskeySchema = z.object({
  passkeyId: z.string().min(1),
});

export const renamePasskeySchema = z.object({
  passkeyId: z.string().min(1),
  name: z.string().min(2).max(50),
});

export type PasskeyLoginSchema = typeof passkeyLoginSchema;
export type DeletePasskeySchema = typeof deletePasskeySchema;
export type RenamePasskeySchema = typeof renamePasskeySchema;
