import { Server, Socket } from 'socket.io';
import { socketErrorHandler } from '../errors';
import { chatService } from '../services';
import { ClientToServerListenersArgs, CustomSocket, CustomSocketServer } from '../types';

export class ChatListener {
  private io: CustomSocketServer;
  private socket: CustomSocket;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  onCreateMessage = async ({
    chatId,
    senderId,
    content,
  }: ClientToServerListenersArgs['message:create']) => {
    try {
      const message = await chatService.createMessage({ chatId, senderId, content });
      this.io.sockets.to(chatId).emit('message:create', message ?? null);
    } catch (err) {
      socketErrorHandler(err);
    }
  };

  onReadMessage = async ({ chatId }: ClientToServerListenersArgs['message:read']) => {
    try {
      await chatService.readMessages({ chatId });
      this.io.sockets.to(chatId).emit('message:read', { chatId });
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

  registerChatListeners = () => {
    this.socket.on('message:create', this.onCreateMessage);
    this.socket.on('message:read', this.onReadMessage);
    this.socket.on('chat:clear', this.onClearChat);
  };
}
