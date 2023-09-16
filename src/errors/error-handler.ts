import { NextFunction, Request, Response } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { ErrorResponse } from '../types';
import { AppError } from './app-errors';

export const errorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
  const errorResponse: ErrorResponse = {
    ok: false,
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
  };

  if ('status' in err && typeof err.status === 'number') {
    errorResponse.status = err.status;
    errorResponse.message = err.message;
    if ('issues' in err) {
      errorResponse.issues = err.issues as string[];
    }
  } else {
    // TODO: log error
  }

  res.status(errorResponse.status).send(errorResponse);
};
