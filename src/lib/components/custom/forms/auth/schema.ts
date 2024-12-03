import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(8).max(50),
});

export const registerSchema = z
  .object({
    username: z.string().min(2).max(50),
    password: z.string().min(8).max(50),
    confirmPassword: z.string().min(8).max(50),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

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

export type LoginSchema = typeof loginSchema;
export type RegisterSchema = typeof registerSchema;
export type ResetPasswordSchema = typeof resetPasswordSchema;
