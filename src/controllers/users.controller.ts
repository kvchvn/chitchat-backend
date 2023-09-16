import { usersService } from '../services';

class UsersController {
  async getUsers(userId: string) {
    return await usersService.getUsers(userId);
  }

  async sendFriendRequest({ senderId, receiverId }: { senderId: string; receiverId: string }) {
    return await usersService.sendFriendRequest({ senderId, receiverId });
  }

  async respondToFriendRequest({
    isAccepted,
    senderId,
    receiverId,
  }: {
    isAccepted: boolean;
    senderId: string;
    receiverId: string;
  }) {
    return isAccepted
      ? await usersService.acceptFriendRequest({ senderId, receiverId })
      : await usersService.refuseFriendRequest({ senderId, receiverId });
  }

  async removeFromFriends({ userId, userFriendId }: { userId: string; userFriendId: string }) {
    return await usersService.removeFromFriends({ userId, userFriendId });
  }
}

export const usersController = new UsersController();
