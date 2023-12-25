import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { NotFoundError } from '../../errors/app-errors';
import { usersService } from '../../services/users-service';

export const userChatsJoining = async (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void
) => {
  try {
    const userId: string | undefined = socket.handshake.auth.userId;

    if (userId) {
      // @ts-ignore: Property 'userId' does not exist on type
      socket.userId = userId;

      const userChats = await usersService.getUserChats(userId);
      if (userChats) {
        // join all the user's chats
        userChats.forEach((chat) => {
          socket.join(chat.id);
        });
      }
      next();
    } else {
      throw new NotFoundError(
        'user',
        { id: userId },
        'userId was not passed from the client with handshake.'
      );
    }
  } catch (err) {
    let message = 'Error occurred in userChatsJoining middleware: ';
    if (err && typeof err === 'object' && 'message' in err) {
      message += err.message;
    } else {
      message += '<no details>';
    }
    const extendedErr = {
      name: 'UserChatsJoiningMiddlewareError',
      message,
    } satisfies ExtendedError;
    next(extendedErr);
  }
};
