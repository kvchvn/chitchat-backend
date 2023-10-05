import { prisma } from '../db';
import { prismaErrorHandler } from '../errors';

class ChatService {
  async getChat({ userId, friendId }: { userId: string; friendId: string }) {
    try {
      const chat = await prisma.chat.findMany({
        where: {
          AND: [{ users: { some: { id: userId } } }, { users: { some: { id: friendId } } }],
        },
        include: {
          messages: true,
        },
      });

      return chat[0];
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
