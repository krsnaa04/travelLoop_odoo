import jwt from 'jsonwebtoken';
import { config } from '../config';
import type { AuthUser } from '../contracts';

export interface AuthTokenPayload {
  sub: string;
  email: string;
  name: string | null;
}

export const signAuthToken = (user: AuthUser) => {
  const payload: AuthTokenPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'],
  });
};

export const verifyAuthToken = (token: string) => {
  return jwt.verify(token, config.jwt.secret) as AuthTokenPayload;
};
