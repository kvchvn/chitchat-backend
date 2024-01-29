import { NextFunction, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { chatsService } from '../services/chats-service';
import { ZodInfer } from '../types/global';
import { ChatResponse } from '../types/responses';
import { aggregateMessagesByDateRecord } from '../utils/aggregate-messages-by-date-record';
import { convertUsersArrayToRecord } from '../utils/convert-users-array-to-record';
import { idSchema } from '../validation/http/schemas';

class ChatsController {
  async getChat(
    req: Request<ZodInfer<typeof idSchema>['params']>,
    res: ChatResponse,
    next: NextFunction
  ) {
    try {
      const chat = await chatsService.getChat(req.params.id);

      if (chat) {
        const messagesByDate = aggregateMessagesByDateRecord(chat.messages);
        const usersRecord = convertUsersArrayToRecord(chat.users);

        res.status(StatusCodes.OK).send({
          data: {
            ...chat,
            users: usersRecord,
            messages: messagesByDate,
            messagesLength: chat._count.messages,
          },
        });
      }
    } catch (err) {
      next(err);
    }
  }
}

export const chatsController = new ChatsController();
