import { Server, Socket } from 'socket.io';
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
      console.log('err: ', err);
    }
  };

  registerChatListeners = () => {
    this.socket.on('message:create', async (args) => {
      await this.onCreateMessage(args);
    });
  };
}
