import { z } from 'zod';

export const idSchema = z.object({
  params: z.object({
    id: z.string().cuid(),
  }),
});

export const friendRequestSchema = z.object({
  params: z.object({
    id: z.string().cuid(),
  }),
  query: z.object({
    requestReceiverId: z.string().cuid(),
  }),
});

export const friendRequestResponseSchema = z.object({
  params: z.object({
    id: z.string().cuid(),
  }),
  query: z.object({
    requestSenderId: z.string().cuid(),
  }),
});

export const friendRemovingSchema = z.object({
  params: z.object({
    id: z.string().cuid(),
  }),
  query: z.object({
    friendId: z.string().cuid(),
  }),
});
