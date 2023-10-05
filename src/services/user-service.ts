import { prisma } from '../db';
import { AppError, BadRequestError, NotFoundError, prismaErrorHandler } from '../errors';

class UserService {
  async getUser(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      });

      if (!user) {
        throw new NotFoundError('user', { id: userId });
      }

      return user;
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async getUserChats(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { chats: true },
      });

      if (!user) {
        throw new AppError(`Chats of user with { id: ${userId} } were not found.`);
      }

      return user.chats;
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async getUsers(userId: string) {
    try {
      const selectRequiredFields = {
        id: true,
        name: true,
        email: true,
        image: true,
      };

      const getAllUsersExceptOneselfPromise = prisma.user.findMany({
        where: { id: { not: userId } },
        select: {
          ...selectRequiredFields,
          _count: {
            select: {
              friends: { where: { id: userId } },
              incomingRequests: { where: { id: userId } },
              outcomingRequests: { where: { id: userId } },
            },
          },
        },
      });

      const getFriendsWithRequestsPromise = prisma.user.findUnique({
        where: { id: userId },
        select: {
          friends: { select: selectRequiredFields },
          incomingRequests: { select: selectRequiredFields },
          outcomingRequests: { select: selectRequiredFields },
        },
      });

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

  async getFriends(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          friends: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundError('user', { id: userId });
      }

      return user.friends;
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
