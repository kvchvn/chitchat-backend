import { NotFoundError } from '../errors';
import { userService } from '../services';

class UsersController {
  async getAllUsersExceptOneself(userId?: string) {
    if (!userId) {
      throw new NotFoundError('user', { userId });
    }
    return await userService.getAllUsersExceptOneself(userId);
  }
}

export const usersController = new UsersController();
