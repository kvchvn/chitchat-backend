import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../../errors/app-errors';

export const validate = async (schema: AnyZodObject, payload: unknown) => {
  try {
    await schema.parseAsync(payload);
    console.log('Validated successfully!', { payload });
  } catch (err) {
    if (err instanceof ZodError) {
      throw new ValidationError(err.issues);
    } else {
      throw err;
    }
  }
};
