import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../../errors/app-errors';
import { idSchema } from './schemas';

export const validate =
  (schema: AnyZodObject) => async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        next(new ValidationError(err.issues));
      } else {
        next(err);
      }
    }
  };

export const validateId = () => validate(idSchema);
