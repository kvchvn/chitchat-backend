import { userService } from '../services';

class UsersController {
  async getAllUsersExceptOneself(userId: string) {
    return await userService.getAllUsersExceptOneself(userId);
  }

  async getFriendsAndFriendRequests(userId: string) {
    return await userService.getUserFriendsAndRequests(userId);
  }

  async sendFriendRequest(senderId: string, receiverId: string) {
    return await userService.sendFriendRequest(senderId, receiverId);
  }
}

export const usersController = new UsersController();
