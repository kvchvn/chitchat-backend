import { z } from 'zod';

export const UserValidationSchema = z.object({
  email: z.string().email(),
  username: z.string().min(4).max(15),
  firstName: z.string().min(1).max(30),
  lastName: z.string().min(1).max(30),
  password: z.string().min(8),
  avatarUrl: z.optional(z.string()),
});

export type User = z.infer<typeof UserValidationSchema>;
