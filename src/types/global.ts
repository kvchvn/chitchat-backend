import { ZodType, z } from 'zod';

export type Nullable<T> = T | null;

export type Entities = 'user' | 'chat' | 'session';

export type ZodInfer<T extends ZodType> = z.infer<T>;

export interface Listener {
  registerListeners: () => void;
}
