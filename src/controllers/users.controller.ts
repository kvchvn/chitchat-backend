import { userService } from '../services';

class UsersController {
  async getAllUsersExceptOneself(userId: string) {
    return await userService.getAllUsersExceptOneself(userId);
  }

  async getFriendsAndFriendRequests(userId: string) {
    return await userService.getUserFriendsAndRequests(userId);
  }

  async sendFriendRequest({ senderId, receiverId }: { senderId: string; receiverId: string }) {
    return await userService.sendFriendRequest({ senderId, receiverId });
  }

  async respondToFriendRequest({
    isPositiveResponse,
    senderId,
    receiverId,
  }: {
    isPositiveResponse: boolean;
    senderId: string;
    receiverId: string;
  }) {
    return isPositiveResponse
      ? await userService.acceptFriendRequest({ senderId, receiverId })
      : await userService.cancelFriendRequest({ senderId, receiverId });
  }

  async removeFromFriends({ userId, userFriendId }: { userId: string; userFriendId: string }) {
    return await userService.removeFromFriends({ userId, userFriendId });
  }
}

export const usersController = new UsersController();
