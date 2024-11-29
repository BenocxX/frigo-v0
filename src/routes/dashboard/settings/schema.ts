import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    oldPassword: z.string().min(2).max(50),
    newPassword: z.string().min(2).max(50),
    confirmNewPassword: z.string().min(2).max(50),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

export type ResetPasswordSchema = typeof resetPasswordSchema;
