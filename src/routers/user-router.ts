import express from 'express';
import { userController } from '../controllers';
import {
  friendRemovalSchema,
  friendRequestSchema,
  friendResponseSchema,
  validate,
  validateUserId,
} from '../validation';

export const userRouter = express.Router();

userRouter.get('/:userId', validateUserId(), userController.getUser);

userRouter.get('/:userId/all', validateUserId(), userController.getUsers);

userRouter.get('/:userId/friends', validateUserId(), userController.getFriends);

userRouter.post(
  '/:userId/friend-request',
  validate(friendRequestSchema),
  userController.sendFriendRequest
);

userRouter.post(
  '/:userId/friend-response',
  validate(friendResponseSchema),
  userController.respondToFriendRequest
);

userRouter.delete(
  '/:userId/friend-removal',
  validate(friendRemovalSchema),
  userController.removeFromFriends
);
