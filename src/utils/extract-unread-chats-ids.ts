import { usersService } from '../services/users-service';

export const extractUnreadChatsIds = ({
  chatsArray,
  userId,
}: {
  chatsArray: NonNullable<Awaited<ReturnType<typeof usersService.getUserChats>>>;
  userId: string;
}) => {
  const unreadChatIds: string[] = [];

  for (const {
    id,
    _count: { messages: unreadMessages },
    messages,
  } of chatsArray) {
    if (unreadMessages && messages[0]?.senderId !== userId) {
      unreadChatIds.push(id);
    }
  }

  return unreadChatIds;
};
