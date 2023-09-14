import express, { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { usersController } from '../controllers';
import { SuccessResponse } from '../types';
import { friendRequestSchema, validate, validateUserId } from '../validation';

export const usersRouter = express.Router();

usersRouter.get(
  '/:userId',
  validateUserId(),
  async (req: Request<{ userId: string }>, res: Response<SuccessResponse>) => {
    const allUsersExceptOneself = await usersController.getAllUsersExceptOneself(req.params.userId);
    res.status(StatusCodes.OK).send({ ok: true, data: allUsersExceptOneself });
  }
);

usersRouter.get(
  '/:userId/friends',
  validateUserId(),
  async (req: Request<{ userId: string }>, res: Response<SuccessResponse>) => {
    const friendsAndFriendRequests = await usersController.getFriendsAndFriendRequests(
      req.params.userId
    );
    res.status(StatusCodes.OK).send({ ok: true, data: friendsAndFriendRequests });
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
      await usersController.sendFriendRequest(req.body.senderId, req.body.receiverId);
    } catch (err) {
      next(err);
    }
    res.status(StatusCodes.ACCEPTED).send({ ok: true });
  }
);
