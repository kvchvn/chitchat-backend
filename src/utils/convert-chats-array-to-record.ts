import { ChatsRecord, ExtendedChat } from '../types/responses';
import { excludeUserByIdFromUsersArray } from './exclude-user-by-id-from-users-array';

export const convertChatsArrayToRecord = ({
  chats,
  userId,
}: {
  chats: ExtendedChat[];
  userId: string;
}) => {
  const chatsRecord: ChatsRecord = {};

  chats.forEach(({ id, isDisabled, messages, users, _count }) => {
    chatsRecord[id] = {
      isDisabled,
      users: excludeUserByIdFromUsersArray({ users, userId }),
      lastMessage: messages[0],
      unreadMessagesCount: _count.messages,
    };
  });

  return chatsRecord;
};
