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
