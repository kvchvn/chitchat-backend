import { isPrismaKnownError } from '../types';
import { BadRequestError, NotFoundError } from './app-errors';

export const prismaErrorHandler = (err: unknown) => {
  console.error('prismaErrorHandler:\n', err);
  if (err instanceof BadRequestError || err instanceof NotFoundError) {
    throw err;
  }

  const message = `Error when accessing the database [${
    isPrismaKnownError(err) ? err.code : 'unknown'
  }]`;
  throw new BadRequestError(message);
};
