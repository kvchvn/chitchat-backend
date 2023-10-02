import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import z from 'zod';
import { chatService } from '../services';
import { ChatWithMessages } from '../types';
import { chatReceivingSchema } from '../validation';

class ChatController {
  async getChat(
    req: Request<
      z.infer<typeof chatReceivingSchema>['params'],
      unknown,
      unknown,
      z.infer<typeof chatReceivingSchema>['query']
    >,
    res: Response<ChatWithMessages | undefined>,
    next: NextFunction
  ) {
    try {
      const chat = await chatService.getChat({
        userId: req.params.userId,
        userFriendId: req.query.friendId,
      });

      res.status(StatusCodes.OK).send(chat);
    } catch (err) {
      next(err);
    }
  }
}

export const chatController = new ChatController();
