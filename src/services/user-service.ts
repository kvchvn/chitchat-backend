import { prisma } from '../db';
import { BadRequestError, NotFoundError, prismaErrorHandler } from '../errors';

class UserService {
  private usersSelect: { id: boolean; name: boolean; email: boolean; image: boolean };

  constructor() {
    this.usersSelect = { id: true, name: true, email: true, image: true };
  }

  async getUser(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: this.usersSelect,
      });

      if (!user) {
        throw new NotFoundError('user', { id });
      }

      return user;
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async getUserChats(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          chats: {
            select: {
              id: true,
              isDisabled: true,
              messages: {
                orderBy: { createdAt: 'desc' },
                select: {
                  content: true,
                  senderId: true,
                  createdAt: true,
                },
                take: 1,
              },
              users: {
                where: { id: { not: id } },
                select: this.usersSelect,
              },
              _count: {
                select: {
                  messages: { where: { isRead: false } },
                },
              },
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundError(`chat`, { id });
      }

      return user.chats;
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async getAllUsers(id: string) {
    try {
      return await prisma.user.findMany({
        select: {
          ...this.usersSelect,
          _count: {
            select: {
              friends: { where: { id } },
              incomingRequests: { where: { id } },
              outcomingRequests: { where: { id } },
            },
          },
        },
      });
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async getUserFriends(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { friends: { select: this.usersSelect } },
      });

      if (user) {
        return user.friends;
      } else {
        throw new NotFoundError('user', { id });
      }
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async getOutcomingRequests(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { outcomingRequests: { select: this.usersSelect } },
      });

      if (user) {
        return user.outcomingRequests;
      } else {
        throw new NotFoundError('user', { id });
      }
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async getIncomingRequests(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { incomingRequests: { select: this.usersSelect } },
      });

      if (user) {
        return user.incomingRequests;
      } else {
        throw new NotFoundError('user', { id });
      }
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async sendFriendRequest({ senderId, receiverId }: { senderId: string; receiverId: string }) {
    try {
      const isRequestAlreadyExisted = Boolean(
        await prisma.user.findUnique({
          where: {
            id: senderId,
            OR: [
              { outcomingRequests: { some: { id: receiverId } } },
              { incomingRequests: { some: { id: receiverId } } },
              { friends: { some: { id: receiverId } } },
            ],
          },
        })
      );

      if (isRequestAlreadyExisted) {
        throw new BadRequestError(
          'Friend request between the sender and the receiver exists (or has been accepted already)'
        );
      }

      await prisma.user.update({
        where: { id: senderId },
        data: { outcomingRequests: { connect: { id: receiverId } } },
      });
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async acceptFriendRequest({
    requestSenderId,
    userId,
  }: {
    requestSenderId: string;
    userId: string;
  }) {
    try {
      const updateSender = prisma.user.update({
        where: { id: requestSenderId },
        data: {
          outcomingRequests: { disconnect: { id: userId } },
          friends: { connect: { id: userId } },
        },
      });

      const updateReceiver = prisma.user.update({
        where: { id: userId },
        data: {
          incomingRequests: { disconnect: { id: requestSenderId } },
          friends: { connect: { id: requestSenderId } },
        },
      });

      const createOrEnableCommonChat = async () => {
        try {
          await prisma.chat.findMany({
            where: { users: { every: { id: { in: [userId, requestSenderId] } } } },
          });
          await prisma.chat.updateMany({
            where: { users: { every: { id: { in: [userId, requestSenderId] } } } },
            data: { isDisabled: false },
          });
        } catch {
          await prisma.chat.create({
            data: {
              users: { connect: [{ id: requestSenderId }, { id: userId }] },
            },
          });
        }
      };

      await Promise.all([updateSender, updateReceiver, createOrEnableCommonChat()]);
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async refuseFriendRequest({
    requestSenderId,
    userId,
  }: {
    requestSenderId: string;
    userId: string;
  }) {
    try {
      await prisma.user.update({
        where: { id: requestSenderId },
        data: { outcomingRequests: { disconnect: { id: userId } } },
      });
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async removeFromFriends({ userId, friendId }: { userId: string; friendId: string }) {
    try {
      const isUserHasTheFriend = Boolean(
        await prisma.user.findUnique({
          where: {
            id: userId,
            friends: { some: { id: friendId } },
          },
        })
      );

      if (!isUserHasTheFriend) {
        throw new NotFoundError('user', { id: userId, friends: [{ id: friendId }] });
      }

      const updateUser = prisma.user.update({
        where: { id: userId },
        data: {
          friends: { disconnect: { id: friendId } },
          friendOf: { disconnect: { id: friendId } },
        },
      });

      const disableCommonChat = prisma.chat.updateMany({
        where: {
          AND: [{ users: { some: { id: userId } } }, { users: { some: { id: friendId } } }],
        },
        data: { isDisabled: true },
      });

      await Promise.all([updateUser, disableCommonChat]);
    } catch (err) {
      prismaErrorHandler(err);
    }
  }
}

export const userService = new UserService();
