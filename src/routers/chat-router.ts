import express from 'express';
import { chatController } from '../controllers/chat-controller';
import { validateId } from '../validation';

export const chatRouter = express.Router();

chatRouter.get('/:id', validateId(), chatController.getChat);
