import { Chat, Message } from '@prisma/client';
import { UserCounts, UserRelevant } from './global';

export type GetUsersResponse = {
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

export type ChatWithMessages = Chat & { messages: Message[] };
