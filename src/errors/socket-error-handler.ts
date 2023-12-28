import { StatusCodes } from 'http-status-codes';
import { ParsedError } from '../types/global';
import { isParsedError } from '../types/guards';
import { CustomSocket } from '../types/socket';

export const socketErrorHandler = (err: unknown, socket: CustomSocket) => {
  const error: ParsedError = isParsedError(err)
    ? err
    : {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Unknown server error.',
      };
  console.log('Socket Error Handler: ', error);
  socket.emit('error', { ...error, message: error.message });
};
