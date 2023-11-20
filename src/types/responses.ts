import { Chat, Message, User } from '@prisma/client';
import { Response } from 'express';

export interface CustomResponse<T>
  extends Response<{
    data: T;
  }> {}

export type UserRelevant = Omit<User, 'emailVerified'>;

export enum UserStatus {
  Default = 'default',
  Me = 'me',
  Friend = 'friend',
  FriendRequestToMeSender = 'friend-request-sender',
  FriendRequestFromMeReceiver = 'friend-request-receiver',
}

export type UserRelevantWithStatus = UserRelevant & { status: UserStatus };

export type UsersCategories = 'all' | 'friends' | 'incomingRequests' | 'outcomingRequests';

export type ExtendedChat = Chat & {
  messages: Pick<Message, 'content' | 'senderId' | 'createdAt'>[];
  users: UserRelevant[];
  _count: { messages: number };
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

export type MessagesRecord = Record<string, Message[]>;

export type ExtendedChatWithMessagesRecord = Chat & {
  users: Omit<UserRelevant, 'email'>[];
  messages: MessagesRecord;
};

// RESPONSES

// common

export type ErrorResponse = {
  data: null;
  status: number;
  message: string;
  issues?: string[];
};

// users

export type UserResponse = CustomResponse<UserRelevant>;

export type AllUsersResponse = CustomResponse<UserRelevantWithStatus[]>;

export type UsersResponse = CustomResponse<UserRelevant[]>;

export type UsersCategoriesAmountResponse = {
  [Property in UsersCategories]: number;
};

export type UserChatsResponse = CustomResponse<ChatsRecord>;

export type FriendRequestResponse = CustomResponse<{
  requestReceiver: UserRelevant;
  isAccepted: boolean;
}>;

// chats

export type ChatResponse = CustomResponse<ExtendedChatWithMessagesRecord>;
