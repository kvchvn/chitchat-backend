import express, { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { usersController } from '../controllers';
import { SuccessResponse } from '../types';
import {
  friendRequestSchema,
  friendResponseSchema,
  friendshipBreakingSchema,
  validate,
  validateUserId,
} from '../validation';

export const usersRouter = express.Router();

usersRouter.get(
  '/:userId',
  validateUserId(),
  async (req: Request<{ userId: string }>, res: Response<SuccessResponse>, next: NextFunction) => {
    try {
      const allUsersExceptOneself = await usersController.getAllUsersExceptOneself(
        req.params.userId
      );
      res.status(StatusCodes.OK).send({ ok: true, data: allUsersExceptOneself });
    } catch (err) {
      next(err);
    }
  }
);

usersRouter.get(
  '/:userId/friends',
  validateUserId(),
  async (req: Request<{ userId: string }>, res: Response<SuccessResponse>, next: NextFunction) => {
    try {
      const friendsAndFriendRequests = await usersController.getFriendsAndFriendRequests(
        req.params.userId
      );
      res.status(StatusCodes.OK).send({ ok: true, data: friendsAndFriendRequests });
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
    res: Response<SuccessResponse>,
    next: NextFunction
  ) => {
    try {
      await usersController.sendFriendRequest(req.body);
      res.status(StatusCodes.ACCEPTED).send({ ok: true });
    } catch (err) {
      next(err);
    }
  }
);

usersRouter.post(
  '/friend-response',
  validate(friendResponseSchema),
  async (
    req: Request<
      unknown,
      unknown,
      { senderId: string; receiverId: string; isPositiveResponse: boolean }
    >,
    res: Response<SuccessResponse>,
    next: NextFunction
  ) => {
    try {
      await usersController.respondToFriendRequest(req.body);
      res.status(StatusCodes.OK).send({ ok: true });
    } catch (err) {
      next(err);
    }
  }
);

usersRouter.delete(
  '/friendship-breaking',
  validate(friendshipBreakingSchema),
  async (
    req: Request<unknown, unknown, { userId: string; userFriendId: string }>,
    res: Response<SuccessResponse>,
    next: NextFunction
  ) => {
    try {
      await usersController.removeFromFriends(req.body);
      res.status(StatusCodes.OK).send({ ok: true });
    } catch (err) {
      next(err);
    }
  }
);
