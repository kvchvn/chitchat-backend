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

export type ExtendedChat = Chat & { messages: Record<string, Message[]> } & {
  users: UserRelevant[];
};

export type ChatsRecord = Record<
  string,
  {
    isDisabled: boolean;
    lastMessage: Pick<Message, 'content' | 'senderId' | 'createdAt'> | undefined;
    users: UserRelevant[];
    unreadMessagesCount: number;
  }
>;
