import express from 'express';
import { usersController } from '../controllers/users-controller';
import {
  friendRemovingSchema,
  friendRequestResponseSchema,
  friendRequestSchema,
} from '../validation/schemas';
import { validate, validateId } from '../validation/validator';

export const usersRouter = express.Router();

usersRouter.get('/:id', validateId(), usersController.getUser);

usersRouter.get('/:id/all', validateId(), usersController.getAllUsers);

usersRouter.get('/:id/friends', validateId(), usersController.getFriends);

usersRouter.get('/:id/incoming-requests', validateId(), usersController.getIncomingRequests);

usersRouter.get('/:id/outcoming-requests', validateId(), usersController.getOutcomingRequests);

usersRouter.get('/:id/chats', validateId(), usersController.getUserChats);

usersRouter.post(
  '/:id/friend-request',
  validate(friendRequestSchema),
  usersController.sendFriendRequest
);

usersRouter.post(
  '/:id/accept-friend-request',
  validate(friendRequestResponseSchema),
  usersController.acceptFriendRequest
);

usersRouter.post(
  '/:id/refuse-friend-request',
  validate(friendRequestResponseSchema),
  usersController.refuseFriendRequest
);

usersRouter.delete(
  '/:id/friend-removing',
  validate(friendRemovingSchema),
  usersController.removeFromFriends
);
