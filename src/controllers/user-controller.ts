import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { userService } from '../services';
import { ChatsWithLastMessage, UserRelevant, Users, ZodInfer } from '../types';
import {
  friendRemovalSchema,
  friendRequestSchema,
  friendResponseSchema,
  idSchema,
} from '../validation';

class UserController {
  async getUser(
    req: Request<ZodInfer<typeof idSchema, 'params'>>,
    res: Response<UserRelevant>,
    next: NextFunction
  ) {
    try {
      const user = await userService.getUser(req.params.id);
      res.status(StatusCodes.OK).send(user);
    } catch (err) {
      next(err);
    }
  }

  async getUsers(
    req: Request<ZodInfer<typeof idSchema, 'params'>>,
    res: Response<Users>,
    next: NextFunction
  ) {
    try {
      const users = await userService.getUsers(req.params.id);
      res.status(StatusCodes.OK).send(users);
    } catch (err) {
      next(err);
    }
  }

  async getUserChats(
    req: Request<ZodInfer<typeof idSchema, 'params'>>,
    res: Response<ChatsWithLastMessage>,
    next: NextFunction
  ) {
    try {
      const chats = await userService.getUserChats(req.params.id);
      res.status(StatusCodes.OK).send(chats);
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
