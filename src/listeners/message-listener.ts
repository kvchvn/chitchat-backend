import { socketErrorHandler } from '../errors/socket-error-handler';
import { messagesService } from '../services/messages-service';
import { Listener } from '../types/global';
import { ClientToServerListenersArgs, CustomSocket, CustomSocketServer } from '../types/socket';
import {
  createMessageSchema,
  editMessageSchema,
  reactToMessageSchema,
  removeMessageSchema,
} from '../validation/socket/schemas';
import { validate } from '../validation/socket/validator';

export class MessageListener implements Listener {
  private io: CustomSocketServer;
  private socket: CustomSocket;

  constructor(io: CustomSocketServer, socket: CustomSocket) {
    this.io = io;
    this.socket = socket;
  }

  onCreateMessage = async (payload: ClientToServerListenersArgs['message:create']) => {
    try {
      await validate(createMessageSchema, payload);

      const message = await messagesService.createMessage(payload);

      if (message) {
        this.io.sockets.to(payload.chatId).emit('message:create', message);
      }
    } catch (err) {
      socketErrorHandler(err);
    }
  };

  onEditMessage = async (payload: ClientToServerListenersArgs['message:edit']) => {
    try {
      await validate(editMessageSchema, payload);

      const { chatId, messageId, updatedContent } = payload;

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

  onRemoveMessage = async (payload: ClientToServerListenersArgs['message:remove']) => {
    try {
      await validate(removeMessageSchema, payload);

      await messagesService.removeMessage(payload.messageId);
      this.io.sockets.to(payload.chatId).emit('message:remove', { messageId: payload.messageId });
    } catch (err) {
      socketErrorHandler(err);
    }
  };

  onReactToMessage = async (payload: ClientToServerListenersArgs['message:react']) => {
    try {
      await validate(reactToMessageSchema, payload);

      const { chatId, messageId, reactions } = payload;

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
