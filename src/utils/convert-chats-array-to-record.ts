import { ChatsRecord, ExtendedChat } from '../types/responses';

export const convertChatsArrayToRecord = (chats: ExtendedChat[]) => {
  const chatsRecord: ChatsRecord = {};

  chats.forEach(({ id, isDisabled, messages, users, _count }) => {
    chatsRecord[id] = {
      isDisabled,
      users,
      lastMessage: messages[0],
      unreadMessagesCount: _count.messages,
    };
  });

  return chatsRecord;
};
