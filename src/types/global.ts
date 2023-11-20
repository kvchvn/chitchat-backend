import { ZodType, z } from 'zod';

export type Nullable<T> = T | null;

export type Entities = 'user' | 'chat';

export type ZodInfer<T extends ZodType, P extends 'params' | 'query' | 'body'> = z.infer<T>[P];

export interface Listener {
  registerListeners: () => void;
}
