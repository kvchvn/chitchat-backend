import { z } from 'zod';

export const userIdSchema = z.object({
  params: z.object({
    userId: z.string().cuid(),
  }),
});

export const friendshipSchema = z.object({
  params: z.object({
    senderId: z.string().cuid(),
    receiverId: z.string().cuid(),
  }),
});
