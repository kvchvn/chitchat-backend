import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { userService } from '../services';
import { GetUsersResponse, UserRelevant, ZodInfer } from '../types';
import {
  friendRemovalSchema,
  friendRequestSchema,
  friendResponseSchema,
  userIdSchema,
} from '../validation';

class UserController {
  async getUser(
    req: Request<ZodInfer<typeof userIdSchema, 'params'>>,
    res: Response<UserRelevant>,
    next: NextFunction
  ) {
    try {
      const user = await userService.getUser(req.params.userId);
      res.status(StatusCodes.OK).send(user);
    } catch (err) {
      next(err);
    }
  }

  async getUsers(
    req: Request<ZodInfer<typeof userIdSchema, 'params'>>,
    res: Response<GetUsersResponse>,
    next: NextFunction
  ) {
    try {
      const users = await userService.getUsers(req.params.userId);
      res.status(StatusCodes.OK).send(users);
    } catch (err) {
      next(err);
    }
  }

  async getFriends(
    req: Request<ZodInfer<typeof userIdSchema, 'params'>>,
    res: Response<GetUsersResponse['friends']>,
    next: NextFunction
  ) {
    try {
      const friends = await userService.getFriends(req.params.userId);
      res.status(StatusCodes.OK).send(friends);
    } catch (err) {
      next(err);
    }
  }

  async sendFriendRequest(
    req: Request<
      ZodInfer<typeof friendRequestSchema, 'params'>,
      unknown,
      unknown,
      ZodInfer<typeof friendRequestSchema, 'query'>
    >,
    res: Response<void>,
    next: NextFunction
  ) {
    try {
      await userService.sendFriendRequest({
        senderId: req.params.userId,
        receiverId: req.query.receiverId,
      });
      res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (err) {
      next(err);
    }
  }

  async respondToFriendRequest(
    req: Request<
      ZodInfer<typeof friendResponseSchema, 'params'>,
      unknown,
      ZodInfer<typeof friendResponseSchema, 'body'>,
      ZodInfer<typeof friendResponseSchema, 'query'>
    >,
    res: Response<void>,
    next: NextFunction
  ) {
    try {
      const payload = {
        userId: req.params.userId,
        requestSenderId: req.query.requestSenderId,
      };

      if (req.body.isAccepted) {
        await userService.acceptFriendRequest(payload);
      } else {
        await userService.refuseFriendRequest(payload);
      }
      res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (err) {
      next(err);
    }
  }

  async removeFromFriends(
    req: Request<
      ZodInfer<typeof friendRemovalSchema, 'params'>,
      unknown,
      unknown,
      ZodInfer<typeof friendRemovalSchema, 'query'>
    >,
    res: Response<void>,
    next: NextFunction
  ) {
    try {
      await userService.removeFromFriends({
        userId: req.params.userId,
        friendId: req.query.friendId,
      });
      res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (err) {
      next(err);
    }
  }
}

export const userController = new UserController();
