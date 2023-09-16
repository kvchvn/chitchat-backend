import express, { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { usersController } from '../controllers';
import { GetUsersResponse } from '../types';
import {
  friendRemovingSchema,
  friendRequestSchema,
  friendResponseSchema,
  validate,
  validateUserId,
} from '../validation';

export const usersRouter = express.Router();

usersRouter.get(
  '/:userId',
  validateUserId(),
  async (req: Request<{ userId: string }>, res: Response<GetUsersResponse>, next: NextFunction) => {
    try {
      const users = await usersController.getUsers(req.params.userId);
      res.status(StatusCodes.OK).send(users);
    } catch (err) {
      next(err);
    }
  }
);

usersRouter.post(
  '/friend-request',
  validate(friendRequestSchema),
  async (
    req: Request<unknown, unknown, { senderId: string; receiverId: string }>,
    res: Response<void>,
    next: NextFunction
  ) => {
    try {
      await usersController.sendFriendRequest(req.body);
      res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (err) {
      next(err);
    }
  }
);

usersRouter.post(
  '/friend-response',
  validate(friendResponseSchema),
  async (
    req: Request<unknown, unknown, { senderId: string; receiverId: string; isAccepted: boolean }>,
    res: Response<void>,
    next: NextFunction
  ) => {
    try {
      await usersController.respondToFriendRequest(req.body);
      res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (err) {
      next(err);
    }
  }
);

usersRouter.delete(
  '/friend-removing',
  validate(friendRemovingSchema),
  async (
    req: Request<unknown, unknown, { userId: string; userFriendId: string }>,
    res: Response<void>,
    next: NextFunction
  ) => {
    try {
      await usersController.removeFromFriends(req.body);
      res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (err) {
      next(err);
    }
  }
);
