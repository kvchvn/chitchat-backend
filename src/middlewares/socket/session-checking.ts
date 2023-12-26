import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { AuthorizationError } from '../../errors/app-errors';
import { sessionService } from '../../services/session-service';

export const sessionChecking = async (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void
) => {
  try {
    const sessionToken: string | undefined = socket.handshake.auth.sessionToken;
    const session = sessionToken ? await sessionService.getSessionByToken(sessionToken) : null;
    if (sessionToken && session) {
      next();
    } else {
      next(new AuthorizationError());
    }
  } catch (err) {
    let message = 'Error occurred in session checking middleware: ';

    if (err && typeof err === 'object' && 'message' in err) {
      message += err.message;
    } else {
      message += '<no details>';
    }

    const extendedErr = { name: 'SocketMiddlewareError', message } satisfies ExtendedError;

    next(extendedErr);
  }
};
