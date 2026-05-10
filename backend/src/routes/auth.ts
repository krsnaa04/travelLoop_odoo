import { Router } from 'express';
import { forgotPassword, login, me, register } from '../controllers/authController';
import { asyncHandler } from '../middleware/asyncHandler';
import { authRequired } from '../middleware/authRequired';

export const authRouter = Router();

authRouter.post('/register', asyncHandler(register));
authRouter.post('/login', asyncHandler(login));
authRouter.post('/forgot-password', asyncHandler(forgotPassword));
authRouter.get('/me', authRequired, asyncHandler(me));
