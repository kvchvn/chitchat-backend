import { Server, Socket } from 'socket.io';
import { socketErrorHandler } from '../errors';
import { messageService } from '../services';
import { ClientToServerListenersArgs, CustomSocket, CustomSocketServer, Listener } from '../types';

export class MessageListener implements Listener {
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
      const message = await messageService.createMessage({ chatId, senderId, content });
      this.io.sockets.to(chatId).emit('message:create', message ?? null);
    } catch (err) {
      socketErrorHandler(err);
    }
  };

  onEditMessage = async ({
    chatId,
    messageId,
    updatedContent,
  }: ClientToServerListenersArgs['message:edit']) => {
    try {
      const updatedMessage = await messageService.editMessage({ id: messageId, updatedContent });

      if (updatedMessage) {
        this.io.sockets
          .to(chatId)
          .emit('message:edit', { messageId, content: updatedMessage.content });
      }
    } catch (err) {
      socketErrorHandler(err);
    }
  };

  onRemoveMessage = async ({
    chatId,
    messageId,
  }: ClientToServerListenersArgs['message:remove']) => {
    try {
      await messageService.removeMessage(messageId);
      this.io.sockets.to(chatId).emit('message:remove', { messageId });
    } catch (err) {
      socketErrorHandler(err);
    }
  };

  onReactToMessage = async ({
    chatId,
    messageId,
    reactions,
  }: ClientToServerListenersArgs['message:react']) => {
    try {
      await messageService.reactToMessage({ id: messageId, reactions });
      this.io.sockets.to(chatId).emit('message:react', { messageId, reactions });
    } catch (err) {
      socketErrorHandler(err);
    }
  };

  registerListeners = () => {
    this.socket.on('message:create', this.onCreateMessage);
    this.socket.on('message:edit', this.onEditMessage);
    this.socket.on('message:remove', this.onRemoveMessage);
    this.socket.on('message:react', this.onReactToMessage);
  };
}
