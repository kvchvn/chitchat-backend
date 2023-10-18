import { Message } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { Nullable } from './global';

export type SocketEvents<T extends Record<string, Nullable<object>>> = {
  [Property in keyof T]: (args: T[Property]) => void;
};

export type ServerToClientListenersArgs = {
  'message:create': Nullable<Message>;
  'message:read': { chatId: string };
  'chat:clear': { chatId: string };
  'message:edit': { messageId: string; content: Message['content'] };
  'message:remove': { messageId: string };
};

export type ClientToServerListenersArgs = {
  'message:create': { chatId: string; senderId: string; content: string };
  'message:read': { chatId: string };
  'chat:clear': { chatId: string };
  'message:edit': { chatId: string; messageId: string; updatedContent: Message['content'] };
  'message:remove': { chatId: string; messageId: string };
};

export type ServerToClientEvents = SocketEvents<ServerToClientListenersArgs>;

export type ClientToServerEvents = SocketEvents<ClientToServerListenersArgs>;

export type CustomSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export type CustomSocketServer = Server<ClientToServerEvents, ServerToClientEvents>;
