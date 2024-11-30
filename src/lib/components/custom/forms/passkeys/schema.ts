import { z } from 'zod';

export const deletePasskeySchema = z.object({
  passkeyId: z.string().min(1),
});

export const renamePasskeySchema = z.object({
  passkeyId: z.string().min(1),
  name: z.string().min(2).max(50),
});

export type DeletePasskeySchema = typeof deletePasskeySchema;
export type RenamePasskeySchema = typeof renamePasskeySchema;
