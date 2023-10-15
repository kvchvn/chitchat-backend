import { prisma } from '../db';
import { NotFoundError, prismaErrorHandler } from '../errors';

class ChatService {
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
          users: true,
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

  async createMessage({
    chatId,
    senderId,
    content,
  }: {
    chatId: string;
    senderId: string;
    content: string;
  }) {
    try {
      const message = await prisma.message.create({
        data: { chatId, senderId, content },
      });
      return message;
    } catch (err) {
      prismaErrorHandler(err);
    }
  }
}

export const chatService = new ChatService();
