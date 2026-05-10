import type { NextFunction, Request, Response } from 'express';
import { verifyAuthToken } from '../utils/jwt';

const unauthorized = (res: Response, message = 'Unauthorized') => {
  return res.status(401).json({ message });
};

export const authRequired = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return unauthorized(res);
  }

  const token = authHeader.slice('Bearer '.length).trim();

  try {
    const payload = verifyAuthToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };
    return next();
  } catch {
    return unauthorized(res, 'Invalid or expired token');
  }
};
