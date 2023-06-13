import bcrypt from 'bcrypt';
import { Model, model, Schema } from 'mongoose';
import { User } from '../../types/user.ts';

type UserMethods = {
  comb: () => Omit<User, 'password'> & { id: string };
};

type UserModel = Model<User, Record<string, never>, UserMethods>;

const UserSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 15,
  },
  firstName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30,
  },
  avatarUrl: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

UserSchema.pre('save', async function preSave(next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.method('comb', function combUser() {
  const { _id, ...restFields } = this.toJSON();
  delete restFields.password;
  delete restFields.__v;
  return { id: _id, ...restFields };
});

export const UserModel = model<User, UserModel>('User', UserSchema);
