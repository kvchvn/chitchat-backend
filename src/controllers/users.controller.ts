import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { usersService } from '../services';
import { GetUsersResponse } from '../types';

class UsersController {
  async getUsers(
    req: Request<{ userId: string }>,
    res: Response<GetUsersResponse>,
    next: NextFunction
  ) {
    try {
      const users = await usersService.getUsers(req.params.userId);
      res.status(StatusCodes.OK).send(users);
    } catch (err) {
      next(err);
    }
  }

  async sendFriendRequest(
    req: Request<unknown, unknown, { senderId: string; receiverId: string }>,
    res: Response<void>,
    next: NextFunction
  ) {
    try {
      const { senderId, receiverId } = req.body;
      await usersService.sendFriendRequest({ senderId, receiverId });
      res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (err) {
      next(err);
    }
  }

  async respondToFriendRequest(
    req: Request<unknown, unknown, { senderId: string; receiverId: string; isAccepted: boolean }>,
    res: Response<void>,
    next: NextFunction
  ) {
    const { senderId, receiverId, isAccepted } = req.body;
    try {
      if (isAccepted) {
        await usersService.acceptFriendRequest({ senderId, receiverId });
      } else {
        await usersService.refuseFriendRequest({ senderId, receiverId });
      }
      res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (err) {
      next(err);
    }
  }

  async removeFromFriends(
    req: Request<unknown, unknown, { userId: string; userFriendId: string }>,
    res: Response<void>,
    next: NextFunction
  ) {
    try {
      const { userId, userFriendId } = req.body;
      await usersService.removeFromFriends({ userId, userFriendId });
      res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (err) {
      next(err);
    }
  }
}

export const usersController = new UsersController();
