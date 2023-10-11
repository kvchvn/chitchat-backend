import { Chat, Message } from '@prisma/client';
import { UserCounts, UserRelevant } from './global';

export type Users = {
  allUsersExceptOneself: (UserRelevant & { _count: UserCounts })[];
  friends?: UserRelevant[];
  incomingRequests?: UserRelevant[];
  outcomingRequests?: UserRelevant[];
};

export type ErrorResponse = {
  ok: false;
  status: number;
  message: string;
  issues?: string[];
};

export type ExtendedChat = Chat & { messages: Message[] } & { users: UserRelevant[] };

export type ChatsWithLastMessage = Array<
  Chat & { messages: Pick<Message, 'content'>[] } & { users: UserRelevant[] }
>;
