import { prisma } from '../db';
import { NotFoundError } from '../errors/app-errors';
import { prismaErrorHandler } from '../errors/prisma-error-handler';

class ChatsService {
  async getChat(id: string) {
    try {
      const chat = await prisma.chat.findUnique({
        where: { id },
        include: {
          messages: {
            orderBy: {
              createdAt: 'asc',
            },
          },
          users: {
            select: {
              id: true,
              name: true,
              image: true,
              sessions: { orderBy: { expires: 'desc' }, select: { expires: true } },
            },
          },
        },
      });

      if (!chat) {
        throw new NotFoundError('chat', { id });
      }

      return chat;
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async clearChat(id: string) {
    try {
      await prisma.chat.update({
        where: { id },
        data: {
          messages: { deleteMany: {} },
        },
      });
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async readMessages(chatId: string) {
    try {
      await prisma.chat.update({
        where: { id: chatId },
        data: {
          messages: {
            updateMany: {
              where: { isRead: false },
              data: { isRead: true },
            },
          },
        },
      });
    } catch (err) {
      prismaErrorHandler(err);
    }
  }
}

export const chatsService = new ChatsService();
