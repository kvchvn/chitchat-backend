import { NextFunction, Request, Response } from 'express';
import { MethodNotAllowedError } from './app-errors';

export const unsupportedRoutesHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(new MethodNotAllowedError());
};
