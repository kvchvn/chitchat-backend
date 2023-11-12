import { Chat, Message } from '@prisma/client';
import { UserRelevant } from './global';

type UserKeys = 'allUsers' | 'friends' | 'incomingRequests' | 'outcomingRequests';

export type Users = {
  [Property in UserKeys]: UserRelevant[] | undefined;
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
