import { NextFunction, Request, Response } from 'express';
import { MethodNotAllowedError } from '../../errors/app-errors';

export const unsupportedRoutesHandling = (_req: Request, _res: Response, next: NextFunction) => {
  next(new MethodNotAllowedError());
};
