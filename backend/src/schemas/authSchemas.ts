import { z } from 'zod';

const email = z.string().email().transform((value) => value.toLowerCase().trim());

export const registerSchema = z.object({
  email,
  password: z.string().min(8).max(72),
  name: z.string().trim().min(2).max(80).optional(),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(8).max(72),
});

export const forgotPasswordSchema = z.object({
  email,
});
