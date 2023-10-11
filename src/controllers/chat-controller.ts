import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { chatService } from '../services';
import { ExtendedChat, ZodInfer } from '../types';
import { idSchema } from '../validation';

class ChatController {
  async getChat(
    req: Request<ZodInfer<typeof idSchema, 'params'>>,
    res: Response<ExtendedChat | undefined>,
    next: NextFunction
  ) {
    try {
      const chat = await chatService.getChat(req.params.id);
      res.status(StatusCodes.OK).send(chat);
    } catch (err) {
      next(err);
    }
  }
}

export const chatController = new ChatController();
