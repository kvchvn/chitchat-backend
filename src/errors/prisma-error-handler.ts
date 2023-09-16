import { isPrismaKnownError } from '../types';
import { BadRequestError } from './app-errors';

export const prismaErrorHandler = (err: unknown) => {
  if (err instanceof BadRequestError) {
    throw err;
  }

  const message = `Error when accessing the database [${
    isPrismaKnownError(err) ? err.code : 'unknown'
  }]`;
  throw new BadRequestError(message);
};
