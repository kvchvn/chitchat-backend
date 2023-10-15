import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
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
    let message = "Error occurred in Socket's middleware: ";
    if (err && typeof err === 'object' && 'message' in err) {
      message += err.message;
    } else {
      message += '<no details>';
    }
    const extendedErr: ExtendedError = { name: 'SocketMiddlewareError', message };
    next(extendedErr);
  }
};
