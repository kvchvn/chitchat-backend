import { NextFunction, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { usersService } from '../services/users-service';
import { ZodInfer } from '../types/global';
import {
  AllUsersResponse,
  FriendRequestResponse,
  UserChatsResponse,
  UserResponse,
  UsersResponse,
} from '../types/responses';
import { addStatusToUserObject } from '../utils/add-status-to-user-object';
import { convertChatsArrayToRecord } from '../utils/convert-chats-array-to-record';
import {
  friendRemovingSchema,
  friendRequestResponseSchema,
  friendRequestSchema,
  idSchema,
} from '../validation/schemas';

class UsersController {
  async getUser(
    req: Request<ZodInfer<typeof idSchema, 'params'>>,
    res: UserResponse,
    next: NextFunction
  ) {
    try {
      const user = await usersService.getUser(req.params.id);

      if (user) {
        res.status(StatusCodes.OK).send({ data: user });
      }
    } catch (err) {
      next(err);
    }
  }

  async getAllUsers(
    req: Request<ZodInfer<typeof idSchema, 'params'>>,
    res: AllUsersResponse,
    next: NextFunction
  ) {
    try {
      const allUsers = await usersService.getAllUsersWithRelationsToCurrentUser(req.params.id);

      if (allUsers) {
        const formattedAllUsers = allUsers.map((user) =>
          addStatusToUserObject({ user, currentUserId: req.params.id })
        );

        res.status(StatusCodes.OK).send({ data: formattedAllUsers });
      }
    } catch (err) {
      next(err);
    }
  }

  async getFriends(
    req: Request<ZodInfer<typeof idSchema, 'params'>>,
    res: UsersResponse,
    next: NextFunction
  ) {
    try {
      const friends = await usersService.getUserFriends(req.params.id);

      if (friends) {
        res.status(StatusCodes.OK).send({ data: friends });
      }
    } catch (err) {
      next(err);
    }
  }

  async getIncomingRequests(
    req: Request<ZodInfer<typeof idSchema, 'params'>>,
    res: UsersResponse,
    next: NextFunction
  ) {
    try {
      const incomingRequests = await usersService.getIncomingRequests(req.params.id);

      if (incomingRequests) {
        res.status(StatusCodes.OK).send({ data: incomingRequests });
      }
    } catch (err) {
      next(err);
    }
  }

  async getOutcomingRequests(
    req: Request<ZodInfer<typeof idSchema, 'params'>>,
    res: UsersResponse,
    next: NextFunction
  ) {
    try {
      const outcomingRequests = await usersService.getOutcomingRequests(req.params.id);

      if (outcomingRequests) {
        res.status(StatusCodes.OK).send({ data: outcomingRequests });
      }
    } catch (err) {
      next(err);
    }
  }

  async getUserChats(
    req: Request<ZodInfer<typeof idSchema, 'params'>>,
    res: UserChatsResponse,
    next: NextFunction
  ) {
    try {
      const chatsArray = await usersService.getUserChats(req.params.id);

      if (chatsArray) {
        const chats = convertChatsArrayToRecord(chatsArray);

        res.status(StatusCodes.OK).send({ data: chats });
      }
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
    res: UserResponse,
    next: NextFunction
  ) {
    try {
      const sender = await usersService.sendFriendRequest({
        senderId: req.params.id,
        receiverId: req.query.requestReceiverId,
      });

      if (sender) {
        res.status(StatusCodes.OK).send({ data: sender });
      }
    } catch (err) {
      next(err);
    }
  }

  async acceptFriendRequest(
    req: Request<
      ZodInfer<typeof friendRequestResponseSchema, 'params'>,
      unknown,
      unknown,
      ZodInfer<typeof friendRequestResponseSchema, 'query'>
    >,
    res: FriendRequestResponse,
    next: NextFunction
  ) {
    try {
      const updatedRequestReceiver = await usersService.acceptFriendRequest({
        requestReceiverId: req.params.id,
        requestSenderId: req.query.requestSenderId,
      });

      if (updatedRequestReceiver) {
        res
          .status(StatusCodes.OK)
          .send({ data: { requestReceiver: updatedRequestReceiver, isAccepted: true } });
      }
    } catch (err) {
      next(err);
    }
  }

  async refuseFriendRequest(
    req: Request<
      ZodInfer<typeof friendRequestResponseSchema, 'params'>,
      unknown,
      unknown,
      ZodInfer<typeof friendRequestResponseSchema, 'query'>
    >,
    res: FriendRequestResponse,
    next: NextFunction
  ) {
    try {
      const updatedRequestReceiver = await usersService.refuseFriendRequest({
        requestReceiverId: req.params.id,
        requestSenderId: req.query.requestSenderId,
      });

      if (updatedRequestReceiver) {
        res
          .status(StatusCodes.OK)
          .send({ data: { requestReceiver: updatedRequestReceiver, isAccepted: false } });
      }
    } catch (err) {
      next(err);
    }
  }

  async removeFromFriends(
    req: Request<
      ZodInfer<typeof friendRemovingSchema, 'params'>,
      unknown,
      unknown,
      ZodInfer<typeof friendRemovingSchema, 'query'>
    >,
    res: UserResponse,
    next: NextFunction
  ) {
    try {
      const updatedUser = await usersService.removeFromFriends({
        userId: req.params.id,
        friendId: req.query.friendId,
      });

      if (updatedUser) {
        res.sendStatus(StatusCodes.OK).send({ data: updatedUser });
      }
    } catch (err) {
      next(err);
    }
  }
}

export const usersController = new UsersController();
