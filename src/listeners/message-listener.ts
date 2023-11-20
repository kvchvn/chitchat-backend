import { socketErrorHandler } from '../errors/socket-error-handler';
import { messagesService } from '../services/messages-service';
import { Listener } from '../types/global';
import { ClientToServerListenersArgs, CustomSocket, CustomSocketServer } from '../types/socket';

export class MessageListener implements Listener {
  private io: CustomSocketServer;
  private socket: CustomSocket;

  constructor(io: CustomSocketServer, socket: CustomSocket) {
    this.io = io;
    this.socket = socket;
  }

  onCreateMessage = async ({
    chatId,
    senderId,
    content,
  }: ClientToServerListenersArgs['message:create']) => {
    try {
      const message = await messagesService.createMessage({ chatId, senderId, content });

      if (message) {
        this.io.sockets.to(chatId).emit('message:create', message);
      }
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
      const updatedMessage = await messagesService.editMessage({ id: messageId, updatedContent });

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
      await messagesService.removeMessage(messageId);
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
      await messagesService.reactToMessage({ id: messageId, reactions });
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
