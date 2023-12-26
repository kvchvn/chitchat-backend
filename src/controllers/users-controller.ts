import { NextFunction, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { usersService } from '../services/users-service';
import { ZodInfer } from '../types/global';
import {
  AllUsersResponse,
  UserChatsResponse,
  UserResponse,
  UsersCategoriesCountResponse,
  UsersResponse,
} from '../types/responses';
import { addStatusToUserObject } from '../utils/add-status-to-user-object';
import { convertChatsArrayToRecord } from '../utils/convert-chats-array-to-record';
import { idSchema } from '../validation/http/schemas';

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

  async getUserCategoriesCount(
    req: Request<ZodInfer<typeof idSchema, 'params'>>,
    res: UsersCategoriesCountResponse,
    next: NextFunction
  ) {
    try {
      const categoriesCount = await usersService.getCategoriesCount(req.params.id);

      if (categoriesCount) {
        res.status(StatusCodes.OK).send({ data: categoriesCount });
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
        const chats = convertChatsArrayToRecord({ chats: chatsArray, userId: req.params.id });
        res.status(StatusCodes.OK).send({ data: chats });
      }
    } catch (err) {
      next(err);
    }
  }
}

export const usersController = new UsersController();
