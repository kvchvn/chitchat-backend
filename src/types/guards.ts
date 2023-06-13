import { AppError } from './common.ts';

export const isAppErrorType = (err: unknown): err is AppError =>
  Boolean(err && typeof err === 'object' && 'status' in err);

export const isObject = (subject: unknown): subject is Record<string | number | symbol, unknown> =>
  Boolean(subject && typeof subject === 'object');
