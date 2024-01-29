import { Chat, Message, Session, User } from '@prisma/client';
import { Response } from 'express';

export interface CustomResponse<T>
  extends Response<{
    data: T;
  }> {}

export type UserRelevant = Omit<User, 'emailVerified'> & { sessions: Pick<Session, 'expires'>[] };

export enum UserStatus {
  Default = 'default',
  Me = 'me',
  Friend = 'friend',
  FriendRequestToMeSender = 'friend-request-sender',
  FriendRequestFromMeReceiver = 'friend-request-receiver',
}

export type UserRelevantWithStatus = UserRelevant & { status: UserStatus };

export type UsersCategories = 'all' | 'friends' | 'incomingRequests' | 'outcomingRequests';

export type UsersCategoriesCount = {
  [Property in UsersCategories]: number;
};

export type UserRelevantWithCategoriesCount = UserRelevant & {
  categoriesCount: {
    [Property in Exclude<UsersCategories, 'all'>]: number;
  };
};

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

export type UnreadChatsIds = {
  ids: string[];
};

export type MessagesRecord = Record<string, Message[]>;

export type ExtendedChatWithMessagesRecord = Chat & {
  users: Record<string, Omit<UserRelevant, 'email' | 'id'>>;
  messages: MessagesRecord;
  messagesLength: number;
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

export type UsersCategoriesCountResponse = CustomResponse<UsersCategoriesCount>;

export type UserChatsResponse = CustomResponse<ChatsRecord>;

export type UserUnreadChatsIdsResponse = CustomResponse<UnreadChatsIds>;

export type UserOperationResponse = CustomResponse<{ isOperationPerformed: boolean }>;

export type UserOperationResponseWithAdditionalData<
  AdditionalData extends Record<string, unknown>,
> = CustomResponse<{ isOperationPerformed: boolean } & AdditionalData>;

// chats

export type ChatResponse = CustomResponse<ExtendedChatWithMessagesRecord>;
