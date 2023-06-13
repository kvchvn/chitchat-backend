import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../common/config.ts';
import { MONGO_ENTITY_ALREADY_EXISTS_CODE } from '../../constants/errors.ts';
import { BadRequest } from '../../errors/app-error.ts';
import { isObject } from '../../types/guards.ts';
import { userService } from '../user/user.service.ts';

class AuthController {
  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.getUserByEmail(req.body.email);
      const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

      if (!isPasswordCorrect) {
        next(new BadRequest('Provided password is not correct.'));
      }

      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET as string, {
        expiresIn: '1d',
      });

      res.status(200).send({ ...user.comb(), token });
    } catch (err) {
      next(err);
    }
  }

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.createNewUser(req.body);
      res.status(StatusCodes.CREATED).send(user.comb());
    } catch (err) {
      if (isObject(err) && 'code' in err && err.code === MONGO_ENTITY_ALREADY_EXISTS_CODE) {
        next(new BadRequest('User with this e-mail/username is already exist.'));
      }
      next(err);
    }
  }
}

export const authController = new AuthController();
