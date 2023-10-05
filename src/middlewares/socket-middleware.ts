import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { socketErrorHandler } from '../errors';
import { userService } from '../services';

export const socketMiddleware = async (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void
) => {
  try {
    const userId: string | undefined = socket.handshake.auth.userId;

    if (userId) {
      // @ts-ignore: Property 'userId' does not exist on type
      socket.userId = userId;

      const userChats = await userService.getUserChats(userId);
      if (userChats) {
        // join all of the user's chats
        userChats.forEach((chat) => {
          socket.join(chat.id);
        });
      }
      next();
    }
  } catch (err) {
    socketErrorHandler(err, next);
  }
};
