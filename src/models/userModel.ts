import { model, Schema } from 'mongoose';

type User = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  avatarUrl?: string;
};

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
  },
  lastName: {
    type: String,
    required: true,
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

export const UserModel = model('User', UserSchema);
