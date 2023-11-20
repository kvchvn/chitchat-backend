import { Message } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { Nullable } from './global';

export type SocketEvents<T extends Record<string, Nullable<object>>> = {
  [Property in keyof T]: (args: T[Property]) => void;
};

export type Reactions = {
  [Property in Extract<keyof Message, 'isLiked'>]: boolean;
};

type ServerToClientChatListenerArgs = {
  'chat:read': { chatId: string };
  'chat:clear': { chatId: string };
};

type ServerToClientMessageListenerArgs = {
  'message:create': Nullable<Message>;
  'message:edit': { messageId: string; content: Message['content'] };
  'message:remove': { messageId: string };
  'message:react': { messageId: string; reactions: Reactions };
};

type ClientToServerChatListenersArgs = {
  'chat:read': { chatId: string };
  'chat:clear': { chatId: string };
};
type ClientToServerMessageListenersArgs = {
  'message:create': { chatId: string; senderId: string; content: string };
  'message:edit': { chatId: string; messageId: string; updatedContent: Message['content'] };
  'message:remove': { chatId: string; messageId: string };
  'message:react': { chatId: string; messageId: string; reactions: Reactions };
};

export type ServerToClientListenersArgs = ServerToClientChatListenerArgs &
  ServerToClientMessageListenerArgs;

export type ClientToServerListenersArgs = ClientToServerChatListenersArgs &
  ClientToServerMessageListenersArgs;

export type ServerToClientEvents = SocketEvents<ServerToClientListenersArgs>;

export type ClientToServerEvents = SocketEvents<ClientToServerListenersArgs>;

export type CustomSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export type CustomSocketServer = Server<ClientToServerEvents, ServerToClientEvents>;
