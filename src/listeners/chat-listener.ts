import { Server, Socket } from 'socket.io';
import { ClientToServerListenersArgs, CustomSocket, CustomSocketServer } from '../types';

export class ChatListener {
  private io: CustomSocketServer;
  private socket: CustomSocket;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  onCreateMessage = ({
    chatId,
    senderId,
    content,
  }: ClientToServerListenersArgs['message:create']) => {
    this.io.sockets.to(chatId).emit('message:create', { content, senderId });
  };

  registerChatListeners() {
    this.socket.on('message:create', this.onCreateMessage);
  }
}
