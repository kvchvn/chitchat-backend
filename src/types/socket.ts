import { Message } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import {
  clearChatSchema,
  createMessageSchema,
  editMessageSchema,
  reactToMessageSchema,
  readChatSchema,
  removeMessageSchema,
} from '../validation/socket/schemas';
import { Nullable, ZodInfer } from './global';

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
  'message:react': { messageId: string; reactions: Partial<Reactions> };
};

type ClientToServerChatListenersArgs = {
  'chat:read': ZodInfer<typeof readChatSchema>;
  'chat:clear': ZodInfer<typeof clearChatSchema>;
};

type ClientToServerMessageListenersArgs = {
  'message:create': ZodInfer<typeof createMessageSchema>;
  'message:edit': ZodInfer<typeof editMessageSchema>;
  'message:remove': ZodInfer<typeof removeMessageSchema>;
  'message:react': ZodInfer<typeof reactToMessageSchema>;
};

export type ServerToClientListenersArgs = ServerToClientChatListenerArgs &
  ServerToClientMessageListenerArgs;

export type ClientToServerListenersArgs = ClientToServerChatListenersArgs &
  ClientToServerMessageListenersArgs;

export type ServerToClientEvents = SocketEvents<ServerToClientListenersArgs>;

export type ClientToServerEvents = SocketEvents<ClientToServerListenersArgs>;

export type CustomSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export type CustomSocketServer = Server<ClientToServerEvents, ServerToClientEvents>;
