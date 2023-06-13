import { Router } from 'express';
import { validator } from '../../validations/validator.ts';
import { UserValidationSchema } from '../user/user.validator.ts';
import { authController } from './auth.controller.ts';

export const authRouter = Router();

authRouter.post(
  '/signin',
  validator(UserValidationSchema.pick({ email: true, password: true })),
  authController.signIn
);

authRouter.post('/signup', validator(UserValidationSchema), authController.signUp);
