import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import z from 'zod';
import { chatService } from '../services';
import { ChatWithMessages } from '../types';
import { chatReceivingSchema } from '../validation';

class ChatController {
  async getChat(
    req: Request<unknown, unknown, z.infer<typeof chatReceivingSchema>['body']>,
    res: Response<ChatWithMessages | undefined>,
    next: NextFunction
  ) {
    try {
      const { userId, userFriendId } = req.body;
      const chat = await chatService.getChat({ userId, userFriendId });

      res.status(StatusCodes.OK).send(chat);
    } catch (err) {
      next(err);
    }
  }
}

export const chatController = new ChatController();
