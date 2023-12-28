import { UserRelevant, UserRelevantWithStatus, UserStatus } from '../types/responses';

type UserRelevantWithCount = {
  _count: {
    friends: number;
    incomingRequests: number;
    outcomingRequests: number;
  };
} & UserRelevant;

export const addStatusToUserObject = ({
  user,
  currentUserId,
}: {
  user: UserRelevantWithCount;
  currentUserId: string;
}) => {
  const { _count: userCount, ...userBasicData } = user;
  const userWithStatus: UserRelevantWithStatus = {
    ...userBasicData,
    status: UserStatus.Default,
  };

  if (userBasicData.id === currentUserId) {
    userWithStatus.status = UserStatus.Me;
  } else if (userCount.friends) {
    userWithStatus.status = UserStatus.Friend;
  } else if (userCount.incomingRequests) {
    userWithStatus.status = UserStatus.FriendRequestFromMeReceiver;
  } else if (userCount.outcomingRequests) {
    userWithStatus.status = UserStatus.FriendRequestToMeSender;
  }

  return userWithStatus;
};
