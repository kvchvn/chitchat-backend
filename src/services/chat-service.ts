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

  async readMessages(chatId: string) {
    try {
      await prisma.chat.update({
        where: { id: chatId },
        data: {
          messages: {
            updateMany: {
              where: { isSeen: false },
              data: { isSeen: true },
            },
          },
        },
      });
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async editMessage({ id, updatedContent }: { id: string; updatedContent: string }) {
    try {
      const updatedMessage = await prisma.message.update({
        where: { id },
        data: {
          content: updatedContent,
          isEdited: true,
        },
      });

      return updatedMessage;
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async removeMessage(id: string) {
    try {
      await prisma.message.delete({ where: { id } });
    } catch (err) {
      prismaErrorHandler(err);
    }
  }
}

export const chatService = new ChatService();
