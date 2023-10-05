import { ExtendedError } from 'socket.io/dist/namespace';

export const socketErrorHandler = (
  err: unknown,
  next: (err?: ExtendedError | undefined) => void
) => {
  let message = "Error occurred in Socket's middleware: ";
  if (err && typeof err === 'object' && 'message' in err) {
    message += err.message;
  } else {
    message += '<no details>';
  }
  const extendedErr: ExtendedError = { name: 'SocketMiddlewareError', message };
  next(extendedErr);
};
