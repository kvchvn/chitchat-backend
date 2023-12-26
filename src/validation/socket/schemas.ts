import { z } from 'zod';

// base schemas

const baseChatSchema = z.object({
  chatId: z.string().cuid(),
});

const baseMessageSchema = z.object({
  chatId: z.string().cuid(),
  messageId: z.string().cuid(),
});

// message related schemas

export const createMessageSchema = baseMessageSchema.pick({ chatId: true }).extend({
  senderId: z.string().cuid(),
  content: z.string(),
});

export const editMessageSchema = baseMessageSchema.extend({
  updatedContent: z.string(),
});

export const removeMessageSchema = baseMessageSchema;

export const reactToMessageSchema = baseMessageSchema.extend({
  reactions: z.record(z.literal('isLiked'), z.boolean()),
});

// chat related schemas

export const readChatSchema = baseChatSchema;

export const clearChatSchema = baseChatSchema;
