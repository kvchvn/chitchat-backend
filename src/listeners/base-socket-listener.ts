import { Server, Socket } from 'socket.io';
import { CustomSocket, CustomSocketServer } from '../types/socket';
import { ChatListener } from './chat-listener';
import { MessageListener } from './message-listener';

export class BaseSocketListener {
  private io: CustomSocketServer;
  private socket: CustomSocket;
  private chatListener: ChatListener;
  private messageListener: MessageListener;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;

    this.chatListener = new ChatListener(this.io, this.socket);
    this.messageListener = new MessageListener(this.io, this.socket);
  }

  onAnyEvent = (event: string, ...args: unknown[]) => {
    console.log('--------------------------------------------------------');
    console.log('Event: ', event);
    console.log('Args: ', args);
    console.log('--------------------------------------------------------');
  };

  onDisconnection = () => {
    console.log('Socket is disconnected: ', this.socket.id);
    console.log('all sockets: ', this.io.sockets.sockets.size);
  };

  onError = (err: Error) => {
    console.log('SocketError!\n', JSON.stringify(err, null, 2));
  };

  registerAllListeners = () => {
    console.log('Socket is connected: ', this.socket.id);
    console.log('all sockets: ', this.io.sockets.sockets.size);

    // base events
    this.socket.onAny(this.onAnyEvent);
    this.socket.on('disconnect', this.onDisconnection);
    this.socket.on('error', this.onError);

    //chat events
    this.chatListener.registerListeners();

    // message events
    this.messageListener.registerListeners();
  };
}
