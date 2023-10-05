import { Server, Socket } from 'socket.io';

export type SocketEvents<T extends Record<string, object>> = {
  [Property in keyof T]: (args: T[Property]) => void;
};

export type ServerToClientListenersArgs = {
  'message:create': { content: string; senderId: string };
};

export type ClientToServerListenersArgs = {
  'message:create': { chatId: string; senderId: string; content: string };
};

export type ServerToClientEvents = SocketEvents<ServerToClientListenersArgs>;

export type ClientToServerEvents = SocketEvents<ClientToServerListenersArgs>;

export type CustomSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export type CustomSocketServer = Server<ClientToServerEvents, ServerToClientEvents>;
