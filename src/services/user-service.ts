import { prisma } from '../db';
import { BadRequestError, NotFoundError, prismaErrorHandler } from '../errors';

class UserService {
  async getUser(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
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
              messages: {
                orderBy: { createdAt: 'desc' },
                select: {
                  content: true,
                  senderId: true,
                },
                take: 1,
              },
              users: {
                where: { id: { not: id } },
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
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

  async getUsers(id: string) {
    try {
      const selectRequiredFields = {
        id: true,
        name: true,
        email: true,
        image: true,
      };

      const getAllUsersExceptOneselfPromise = prisma.user.findMany({
        where: { id: { not: id } },
        select: {
          ...selectRequiredFields,
          _count: {
            select: {
              friends: { where: { id } },
              incomingRequests: { where: { id } },
              outcomingRequests: { where: { id } },
            },
          },
        },
      });

      const getFriendsWithRequestsPromise = prisma.user.findUnique({
        where: { id },
        select: {
          friends: { select: selectRequiredFields },
          incomingRequests: { select: selectRequiredFields },
          outcomingRequests: { select: selectRequiredFields },
        },
      });

      if (!getFriendsWithRequestsPromise) {
        throw new NotFoundError('user', { id });
      }

      const [allUsersExceptOneself, friendsWithRequests] = await Promise.all([
        getAllUsersExceptOneselfPromise,
        getFriendsWithRequestsPromise,
      ]);

      return {
        allUsersExceptOneself,
        ...friendsWithRequests,
      };
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async sendFriendRequest({ senderId, receiverId }: { senderId: string; receiverId: string }) {
    try {
      const isSenderAlreadySentOrGotRequest = Boolean(
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

      if (isSenderAlreadySentOrGotRequest) {
        throw new BadRequestError('This friend request is already has been sent or accepted.');
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

      const createCommonChat = prisma.chat.create({
        data: {
          users: { connect: [{ id: requestSenderId }, { id: userId }] },
        },
      });

      await Promise.all([updateSender, updateReceiver, createCommonChat]);
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
        throw new BadRequestError("There isn't this user, or the user hasn't this friend.");
      }

      const updateUser = prisma.user.update({
        where: { id: userId },
        data: {
          friends: { disconnect: { id: friendId } },
          friendOf: { disconnect: { id: friendId } },
        },
      });

      const removeCommonChat = prisma.chat.deleteMany({
        where: {
          AND: [{ users: { some: { id: userId } } }, { users: { some: { id: friendId } } }],
        },
      });

      await Promise.all([updateUser, removeCommonChat]);
    } catch (err) {
      prismaErrorHandler(err);
    }
  }
}

export const userService = new UserService();
