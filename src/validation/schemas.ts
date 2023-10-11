import { z } from 'zod';

export const idSchema = z.object({
  params: z.object({
    id: z.string().cuid(),
  }),
});

export const friendRequestSchema = z.object({
  params: z.object({
    userId: z.string().cuid(),
  }),
  query: z.object({
    receiverId: z.string().cuid(),
  }),
});

export const friendResponseSchema = z.object({
  params: z.object({
    userId: z.string().cuid(),
  }),
  body: z.object({
    isAccepted: z.boolean(),
  }),
  query: z.object({
    requestSenderId: z.string().cuid(),
  }),
});

export const friendRemovalSchema = z.object({
  params: z.object({
    userId: z.string().cuid(),
  }),
  query: z.object({
    friendId: z.string().cuid(),
  }),
});

export const chatReceivingSchema = friendRemovalSchema;

export const messageCreatingSchema = z.object({
  params: z.object({
    chatId: z.string().cuid(),
  }),
  query: z.object({
    senderId: z.string().cuid(),
  }),
  body: z.object({
    content: z.string(),
  }),
});
