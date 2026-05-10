import type { Request, Response } from 'express';
import { AppError } from '../errors';
import { forgotPasswordSchema, loginSchema, registerSchema } from '../schemas/authSchemas';
import { getUserById, loginUser, registerUser } from '../services/authService';
import { signAuthToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  const payload = registerSchema.parse(req.body);
  const user = await registerUser(payload);
  const token = signAuthToken(user);

  return res.status(201).json({
    token,
    user,
  });
};

export const login = async (req: Request, res: Response) => {
  const payload = loginSchema.parse(req.body);
  const user = await loginUser(payload);
  const token = signAuthToken(user);

  return res.json({
    token,
    user,
  });
};

export const me = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }
  const user = await getUserById(req.user.id);
  return res.json({ user });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const payload = forgotPasswordSchema.parse(req.body);
  return res.json({
    message: `Password reset instructions are not enabled in this hackathon build yet. Placeholder accepted for ${payload.email}.`,
  });
};
