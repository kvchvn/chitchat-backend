import { User } from '@prisma/client';

export type Entities = 'user';

export type UserCounts = {
  friends: number;
  incomingRequests: number;
  outcomingRequests: number;
};

export type UserRelevant = Omit<User, 'emailVerified'>;
