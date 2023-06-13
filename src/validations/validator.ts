import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { ValidationError } from '../errors/app-error.ts';

export const validator =
  <T>(zodSchema: z.ZodType<T>) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await zodSchema.parseAsync(req.body);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const issues = err.issues.reduce(
          (acc, issue) => ({
            ...acc,
            [issue.path[0]]: issue.message.toLowerCase(),
          }),
          {}
        );
        next(new ValidationError('Invalid data are passed.', issues));
      }
      next(err);
    }
  };
