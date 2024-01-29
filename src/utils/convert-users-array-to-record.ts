import { chatsService } from '../services/chats-service';

export const convertUsersArrayToRecord = (
  users: NonNullable<Awaited<ReturnType<typeof chatsService.getChat>>>['users']
) => {
  const usersRecord: Record<string, Omit<(typeof users)[0], 'id'>> = {};

  for (const { id, ...user } of users) {
    usersRecord[id] = user;
  }

  return usersRecord;
};
