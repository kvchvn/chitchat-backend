import { prisma } from '../db';
import { BadRequestError, NotFoundError } from '../errors/app-errors';
import { prismaErrorHandler } from '../errors/prisma-error-handler';
import { Reactions } from '../types/socket';

class MessagesService {
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
      const chat = await prisma.chat.findUnique({
        where: { id: chatId },
      });

      if (!chat) {
        throw new NotFoundError('chat', { id: chatId });
      }

      if (chat.isDisabled) {
        throw new BadRequestError(
          `Chat ${chatId} is disabled. Unable to create a message with content: ${content}`
        );
      }

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

  async reactToMessage({ id, reactions }: { id: string; reactions: Partial<Reactions> }) {
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

export const messagesService = new MessagesService();
