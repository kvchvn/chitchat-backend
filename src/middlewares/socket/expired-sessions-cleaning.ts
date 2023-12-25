import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { usersService } from '../../services/users-service';

export const expiredSessionsCleaning = async (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void
) => {
  try {
    if ('userId' in socket && typeof socket.userId === 'string') {
      const usersSessions = await usersService.getUsersSessions(socket.userId);

      const expiredSessionIds = usersSessions
        ?.filter((session) => {
          const expiresDate = new Date(session.expires);
          return Number(expiresDate) < Date.now();
        })
        .map((session) => session.id);

      if (expiredSessionIds) {
        await usersService.removeUsersSessions({
          userId: socket.userId,
          sessionIds: expiredSessionIds,
        });
      }
    }
    next();
  } catch (err) {
    let message = 'Error occurred in sessions cleaning middleware: ';
    if (err && typeof err === 'object' && 'message' in err) {
      message += err.message;
    } else {
      message += '<no details>';
    }
    const extendedErr = {
      name: 'SessionsCleaningMiddlewareError',
      message,
    } satisfies ExtendedError;
    next(extendedErr);
  }
};
