import express from 'express';
import { chatController } from '../controllers/chat-controller';
import { chatReceivingSchema, validate } from '../validation';

export const chatRouter = express.Router();

chatRouter.get('/:userId', validate(chatReceivingSchema), chatController.getChat);
