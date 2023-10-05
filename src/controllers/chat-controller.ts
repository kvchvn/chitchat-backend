import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { chatService } from '../services';
import { ChatWithMessages, ZodInfer } from '../types';
import { chatReceivingSchema } from '../validation';

class ChatController {
  async getChat(
    req: Request<
      ZodInfer<typeof chatReceivingSchema, 'params'>,
      unknown,
      unknown,
      ZodInfer<typeof chatReceivingSchema, 'query'>
    >,
    res: Response<ChatWithMessages | undefined>,
    next: NextFunction
  ) {
    try {
      const chat = await chatService.getChat({
        userId: req.params.userId,
        friendId: req.query.friendId,
      });

      res.status(StatusCodes.OK).send(chat);
    } catch (err) {
      next(err);
    }
  }
}

export const chatController = new ChatController();
