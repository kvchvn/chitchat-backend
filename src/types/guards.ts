import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ParsedError } from './global';

export const isPrismaKnownError = (err: unknown): err is PrismaClientKnownRequestError =>
  Boolean(err && typeof err === 'object' && 'code' in err);

export const isParsedError = (err: unknown): err is ParsedError =>
  Boolean(
    err &&
      typeof err === 'object' &&
      'status' in err &&
      typeof err.status === 'number' &&
      'message' in err &&
      typeof err.message === 'string'
  );
