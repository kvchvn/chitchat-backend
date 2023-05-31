import { Router } from 'express';
import { authController } from '../controllers/index.ts';

export const authRouter = Router();

authRouter.post('/signin', authController.signIn);
authRouter.post('/signup', authController.signUp);
