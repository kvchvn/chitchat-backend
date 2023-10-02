import { User } from '@prisma/client';
import { ZodType, z } from 'zod';

export type Entities = 'user';

export type UserCounts = {
  friends: number;
  incomingRequests: number;
  outcomingRequests: number;
};

export type UserRelevant = Omit<User, 'emailVerified'>;

export type ZodInfer<T extends ZodType, P extends 'params' | 'query' | 'body'> = z.infer<T>[P];
