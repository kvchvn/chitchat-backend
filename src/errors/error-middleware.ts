import { NextFunction, Request, Response } from 'express';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { AppError } from '../types/common.ts';
import { isAppErrorType } from '../types/guards.ts';

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let status = StatusCodes.INTERNAL_SERVER_ERROR;
  const errorResponse: Omit<AppError, 'status'> & { error: true } = {
    error: true,
    message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
  };

  if (isAppErrorType(err)) {
    status = err.status;
    errorResponse.message = err.message;
    if (err.issues) {
      errorResponse.issues = err.issues;
    }
  }

  res.status(status).send(errorResponse);
};
