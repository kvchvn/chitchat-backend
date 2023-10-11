import express from 'express';
import { userController } from '../controllers';
import {
  friendRemovalSchema,
  friendRequestSchema,
  friendResponseSchema,
  validate,
  validateId,
} from '../validation';

export const userRouter = express.Router();

userRouter.get('/:id', validateId(), userController.getUser);

userRouter.get('/:id/all', validateId(), userController.getUsers);

userRouter.get('/:id/chats', validateId(), userController.getUserChats);

userRouter.post(
  '/:id/friend-request',
  validate(friendRequestSchema),
  userController.sendFriendRequest
);

userRouter.post(
  '/:id/friend-response',
  validate(friendResponseSchema),
  userController.respondToFriendRequest
);

userRouter.delete(
  '/:id/friend-removal',
  validate(friendRemovalSchema),
  userController.removeFromFriends
);
