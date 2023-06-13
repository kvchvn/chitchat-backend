import { NotFoundError } from '../../errors/app-error.ts';
import { User } from '../../types/user.ts';
import { UserModel } from './user.model.ts';

class UserService {
  async getUserById(id: string) {
    const user = await UserModel.findById(id).exec();
    if (!user) {
      throw new NotFoundError({ entity: 'user', params: { id } });
    }

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await UserModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundError({ entity: 'user', params: { email } });
    }

    return user;
  }

  async createNewUser(userData: User) {
    const user = new UserModel(userData);
    await UserModel.create(user);
    return user;
  }
}

export const userService = new UserService();
