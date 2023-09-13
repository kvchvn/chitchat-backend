import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { usersController } from '../controllers';
import { validateUserId } from '../validation';

export const usersRouter = express.Router();

usersRouter.get('/:userId', validateUserId(), async (req, res) => {
  const allUsersExceptOneself = await usersController.getAllUsersExceptOneself(req.params.userId);
  res.status(StatusCodes.OK).send(allUsersExceptOneself);
});
