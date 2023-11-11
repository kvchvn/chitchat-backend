import { User } from '@prisma/client';
import { ZodType, z } from 'zod';

export type Nullable<T> = T | null;

export type Entities = 'user' | 'chat';

export type UserCounts = {
  friends: number;
  incomingRequests: number;
  outcomingRequests: number;
};

export type UserRelevant = Omit<User, 'emailVerified'>;

export type ZodInfer<T extends ZodType, P extends 'params' | 'query' | 'body'> = z.infer<T>[P];

export interface Listener {
  registerListeners: () => void;
}
