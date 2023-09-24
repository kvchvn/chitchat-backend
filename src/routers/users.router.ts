import express from 'express';
import { usersController } from '../controllers';
import {
  friendRemovingSchema,
  friendRequestSchema,
  friendResponseSchema,
  validate,
  validateUserId,
} from '../validation';

export const usersRouter = express.Router();

usersRouter.get('/:userId', validateUserId(), usersController.getUsers);

usersRouter.get('/:userId/friends', validateUserId(), usersController.getFriends);

usersRouter.post(
  '/friend-request',
  validate(friendRequestSchema),
  usersController.sendFriendRequest
);

usersRouter.post(
  '/friend-response',
  validate(friendResponseSchema),
  usersController.respondToFriendRequest
);

usersRouter.delete(
  '/friend-removing',
  validate(friendRemovingSchema),
  usersController.removeFromFriends
);
