import { socketErrorHandler } from '../errors/socket-error-handler';
import { chatsService } from '../services/chats-service';
import { Listener } from '../types/global';
import { ClientToServerListenersArgs, CustomSocket, CustomSocketServer } from '../types/socket';
import { clearChatSchema, readChatSchema } from '../validation/socket/schemas';
import { validate } from '../validation/socket/validator';

export class ChatListener implements Listener {
  private io: CustomSocketServer;
  private socket: CustomSocket;

  constructor(io: CustomSocketServer, socket: CustomSocket) {
    this.io = io;
    this.socket = socket;
  }

  onReadChat = async ({ chatId }: ClientToServerListenersArgs['chat:read']) => {
    try {
      await validate(readChatSchema, { chatId });

      await chatsService.readMessages(chatId);
      this.io.sockets.to(chatId).emit('chat:read', { chatId });
    } catch (err) {
      socketErrorHandler(err, this.socket);
    }
  };

  onClearChat = async ({ chatId }: ClientToServerListenersArgs['chat:clear']) => {
    try {
      await validate(clearChatSchema, { chatId });

      await chatsService.clearChat(chatId);
      this.io.sockets.to(chatId).emit('chat:clear', { chatId });
    } catch (err) {
      socketErrorHandler(err, this.socket);
    }
  };

  registerListeners = () => {
    this.socket.on('chat:read', this.onReadChat);
    this.socket.on('chat:clear', this.onClearChat);
  };
}
