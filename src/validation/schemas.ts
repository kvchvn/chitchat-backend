import { z } from 'zod';

export const userIdSchema = z.object({
  params: z.object({
    userId: z.string().cuid(),
  }),
});

export const friendRequestSchema = z.object({
  body: z.object({
    senderId: z.string().cuid(),
    receiverId: z.string().cuid(),
  }),
});

export const friendResponseSchema = z.object({
  body: z.object({
    isPositiveResponse: z.boolean(),
    senderId: z.string().cuid(),
    receiverId: z.string().cuid(),
  }),
});

export const friendRemovingSchema = z.object({
  body: z.object({
    userId: z.string().cuid(),
    userFriendId: z.string().cuid(),
  }),
});
