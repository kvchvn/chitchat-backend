import { isPrismaKnownError } from '../types/guards';
import { AppError, BadRequestError } from './app-errors';

export const prismaErrorHandler = (err: unknown) => {
  console.error('prismaErrorHandler:\n', err);
  if (err instanceof AppError) {
    throw err;
  }

  const code = { code: isPrismaKnownError(err) ? err.code : 'unknown' };

  const message = `Error when accessing the database [code: ${code}]`;
  throw new BadRequestError(message);
};
