import { Server, Socket } from 'socket.io';
import { socketErrorHandler } from '../errors';
import { chatService } from '../services';
import { ClientToServerListenersArgs, CustomSocket, CustomSocketServer, Listener } from '../types';

export class ChatListener implements Listener {
  private io: CustomSocketServer;
  private socket: CustomSocket;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  onReadChat = async ({ chatId }: ClientToServerListenersArgs['chat:read']) => {
    try {
      await chatService.readMessages(chatId);
      this.io.sockets.to(chatId).emit('chat:read', { chatId });
    } catch (err) {
      socketErrorHandler(err);
    }
  };

  onClearChat = async ({ chatId }: ClientToServerListenersArgs['chat:clear']) => {
    try {
      await chatService.clearChat(chatId);
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
