import { prisma } from '../db';
import { prismaErrorHandler } from '../errors';
import { Reactions } from '../types';

class MessageService {
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

  async reactToMessage({ id, reactions }: { id: string; reactions: Reactions }) {
    try {
      await prisma.message.update({
        where: { id },
        data: {
          ...reactions,
        },
      });
    } catch (err) {
      prismaErrorHandler(err);
    }
  }
}

export const messageService = new MessageService();
