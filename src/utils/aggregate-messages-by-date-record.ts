import { Message } from '@prisma/client';

export const aggregateMessagesByDateRecord = (messages: Message[]) => {
  const messagesByDate: Record<string, Message[]> = {};

  messages.forEach((message) => {
    // "+1" to get correct month
    const month = message.createdAt.getMonth() + 1;
    const date = message.createdAt.getDate();
    const year = message.createdAt.getFullYear();
    const key = `${month}/${date}/${year}`;

    if (key in messagesByDate) {
      messagesByDate[key]?.push(message);
    } else {
      messagesByDate[key] = [message];
    }
  });

  return messagesByDate;
};
