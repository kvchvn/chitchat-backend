import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { userService } from '../services';
import { ChatsRecord, UserRelevant, Users, ZodInfer } from '../types';
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
      const allUsersPromise = userService.getAllUsers(req.params.id);
      const friendsPromise = userService.getUserFriends(req.params.id);
      const incomingRequestsPromise = userService.getIncomingRequests(req.params.id);
      const outcomingRequestsPromise = userService.getOutcomingRequests(req.params.id);

      const [allUsers, friends, incomingRequests, outcomingRequests] = await Promise.all([
        allUsersPromise,
        friendsPromise,
        incomingRequestsPromise,
        outcomingRequestsPromise,
      ]);

      res
        .status(StatusCodes.OK)
        .send({ all: allUsers, friends, incomingRequests, outcomingRequests });
    } catch (err) {
      next(err);
    }
  }

  async getUserChats(
    req: Request<ZodInfer<typeof idSchema, 'params'>>,
    res: Response<ChatsRecord>,
    next: NextFunction
  ) {
    try {
      const chatsArray = await userService.getUserChats(req.params.id);
      const chats: ChatsRecord = {};

      if (chatsArray) {
        chatsArray.forEach(({ id, isDisabled, messages, users, _count }) => {
          chats[id] = {
            isDisabled,
            users,
            lastMessage: messages[0],
            unreadMessagesCount: _count.messages,
          };
        });
      }

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
        senderId: req.params.id,
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
        userId: req.params.id,
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
        userId: req.params.id,
        friendId: req.query.friendId,
      });
      res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (err) {
      next(err);
    }
  }
}

export const userController = new UserController();
