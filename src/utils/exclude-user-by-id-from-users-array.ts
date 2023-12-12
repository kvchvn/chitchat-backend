import { UserRelevant } from '../types/responses';

export const excludeUserByIdFromUsersArray = ({
  users,
  userId,
}: {
  users: UserRelevant[];
  userId: string;
}) => {
  const copiedUsers = [...users];
  const userIndex = copiedUsers.findIndex((user) => user.id === userId);

  if (userIndex !== -1) {
    copiedUsers.splice(userIndex, 1);
  }

  return copiedUsers;
};
