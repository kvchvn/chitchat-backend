import { StatusCodes } from 'http-status-codes';
import { MONGO_ENTITY_ALREADY_EXISTS_CODE } from '../constants/index.ts';
import { ErrorResponse } from '../types/index.ts';

class ErrorController {
  getDefaultInternalServerError(): ErrorResponse {
    return {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      result: 'error',
      data: { message: 'Произошла ошибка на сервере' },
    };
  }

  parseUserError(err: unknown): ErrorResponse {
    if (typeof err === 'object' && err) {
      if ('code' in err && err.code === MONGO_ENTITY_ALREADY_EXISTS_CODE) {
        return {
          code: StatusCodes.BAD_REQUEST,
          result: 'error',
          data: {
            message: 'Пользователь с таким email и/или username уже существует.',
          },
        };
      }
    }

    return this.getDefaultInternalServerError();
  }
}

export const errorController = new ErrorController();
