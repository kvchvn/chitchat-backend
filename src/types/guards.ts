import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const isPrismaKnownError = (err: unknown): err is PrismaClientKnownRequestError =>
  Boolean(err && typeof err === 'object' && 'code' in err);
