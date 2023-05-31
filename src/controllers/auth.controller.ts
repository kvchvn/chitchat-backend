import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserModel } from '../models/index.ts';
import { errorController } from './error.controller.ts';

class AuthController {
  signIn(req: Request, res: Response, next: NextFunction) {
    console.log(req, res, next);
  }

  async signUp(req: Request, res: Response) {
    try {
      const user = await UserModel.create(req.body);
      res.status(StatusCodes.CREATED).send(user);
    } catch (err) {
      const errorResponse = errorController.parseUserError(err);
      res.status(errorResponse.code).send(errorResponse);
    }
  }
}

export const authController = new AuthController();
