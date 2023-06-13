import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { userService } from './user.service.ts';

class UserController {
  async getUserById(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;
    try {
      const user = await userService.getUserById(userId);
      res.status(StatusCodes.OK).send(user.comb());
    } catch (err) {
      next(err);
    }
  }
}

export const userController = new UserController();
