import { Router } from 'express';
import { userController } from './user.controller.ts';

export const userRouter = Router();

userRouter.get('/:userId', userController.getUserById);
