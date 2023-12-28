import { NextFunction, Request, Response } from 'express';
import { SESSION_TOKEN_COOKIE } from '../../constants/global';
import { AuthorizationError } from '../../errors/app-errors';
import { sessionService } from '../../services/session-service';

export const authorization = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const sessionToken: string | undefined = req.cookies[SESSION_TOKEN_COOKIE];
    const session = sessionToken ? await sessionService.getSessionByToken(sessionToken) : null;

    if (sessionToken && session) {
      next();
    } else {
      next(new AuthorizationError());
    }
  } catch (err) {
    next(err);
  }
};
