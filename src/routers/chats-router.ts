import express from 'express';
import { chatsController } from '../controllers/chats-controller';
import { validateId } from '../validation/validator';

export const chatsRouter = express.Router();

chatsRouter.get('/:id', validateId(), chatsController.getChat);
