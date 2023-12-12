import express from 'express';
import { usersController } from '../controllers/users-controller';
import { usersFriendshipController } from '../controllers/users-friendship-controller';
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

usersRouter.get('/:id/categories-count', validateId(), usersController.getUserCategoriesCount);

usersRouter.get('/:id/incoming-requests', validateId(), usersController.getIncomingRequests);

usersRouter.get('/:id/outcoming-requests', validateId(), usersController.getOutcomingRequests);

usersRouter.get('/:id/chats', validateId(), usersController.getUserChats);

usersRouter.post(
  '/:id/friend-request',
  validate(friendRequestSchema),
  usersFriendshipController.sendFriendRequest
);

usersRouter.delete(
  '/:id/friend-request-cancelling',
  validate(friendRequestSchema),
  usersFriendshipController.cancelFriendRequest
);

usersRouter.post(
  '/:id/accept-friend-request',
  validate(friendRequestResponseSchema),
  usersFriendshipController.acceptFriendRequest
);

usersRouter.post(
  '/:id/refuse-friend-request',
  validate(friendRequestResponseSchema),
  usersFriendshipController.refuseFriendRequest
);

usersRouter.delete(
  '/:id/friend-removing',
  validate(friendRemovingSchema),
  usersFriendshipController.removeFromFriends
);
