import { Server, Socket } from 'socket.io';
import { CustomSocket, CustomSocketServer } from '../types';
import { ChatListener } from './chat-listener';

export class BaseSocketListener {
  private io: CustomSocketServer;
  private socket: CustomSocket;
  private chatListener: ChatListener;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;

    this.chatListener = new ChatListener(this.io, this.socket);
  }

  onAnyEvent = (event: string, ...args: unknown[]) => {
    console.log('--------------------------------------------------------');
    console.log('Event: ', event);
    console.log('Args: ', args);
    console.log('--------------------------------------------------------');
  };

  onDisconnection = () => {
    console.log('Socket is disconnected: ', this.socket.id);
  };

  registerAllListeners = () => {
    console.log('Socket is connected: ', this.socket.id);

    // base events
    this.socket.onAny(this.onAnyEvent);
    this.socket.on('disconnect', this.onDisconnection);

    //chat events
    this.chatListener.registerChatListeners();
  };
}
