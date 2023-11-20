import { socketErrorHandler } from '../errors/socket-error-handler';
import { chatsService } from '../services/chats-service';
import { Listener } from '../types/global';
import { ClientToServerListenersArgs, CustomSocket, CustomSocketServer } from '../types/socket';

export class ChatListener implements Listener {
  private io: CustomSocketServer;
  private socket: CustomSocket;

  constructor(io: CustomSocketServer, socket: CustomSocket) {
    this.io = io;
    this.socket = socket;
  }

  onReadChat = async ({ chatId }: ClientToServerListenersArgs['chat:read']) => {
    try {
      await chatsService.readMessages(chatId);
      this.io.sockets.to(chatId).emit('chat:read', { chatId });
    } catch (err) {
      socketErrorHandler(err);
    }
  };

  onClearChat = async ({ chatId }: ClientToServerListenersArgs['chat:clear']) => {
    try {
      await chatsService.clearChat(chatId);
      this.io.sockets.to(chatId).emit('chat:clear', { chatId });
    } catch (err) {
      socketErrorHandler(err);
    }
  };

  registerListeners = () => {
    this.socket.on('chat:read', this.onReadChat);
    this.socket.on('chat:clear', this.onClearChat);
  };
}
