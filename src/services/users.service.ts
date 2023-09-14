import { prisma } from '../db';
import { BadRequestError, prismaErrorHandler } from '../errors';

class UsersService {
  async getAllUsersExceptOneself(userId: string) {
    try {
      return await prisma.user.findMany({
        where: { id: { not: userId } },
      });
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async getUserFriendsAndRequests(userId: string) {
    try {
      return await prisma.user.findUnique({
        where: { id: userId },
        select: {
          friends: true,
          friendOf: true,
          incomingRequests: true,
          outcomingRequests: true,
        },
      });
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

      const updateSender = prisma.user.update({
        where: { id: senderId },
        data: { outcomingRequests: { connect: { id: receiverId } } },
      });
      const updateReceiver = prisma.user.update({
        where: { id: receiverId },
        data: { incomingRequests: { connect: { id: senderId } } },
      });
      return await prisma.$transaction([updateSender, updateReceiver]);
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async acceptFriendRequest({ senderId, receiverId }: { senderId: string; receiverId: string }) {
    try {
      const updateSender = prisma.user.update({
        where: { id: senderId },
        data: {
          outcomingRequests: { disconnect: { id: receiverId } },
          friends: { connect: { id: receiverId } },
        },
      });
      const updateReceiver = prisma.user.update({
        where: { id: receiverId },
        data: {
          incomingRequests: { disconnect: { id: senderId } },
          friends: { connect: { id: senderId } },
        },
      });
      await prisma.$transaction([updateSender, updateReceiver]);
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async cancelFriendRequest({ senderId, receiverId }: { senderId: string; receiverId: string }) {
    try {
      const updateSender = prisma.user.update({
        where: { id: senderId },
        data: { outcomingRequests: { disconnect: { id: receiverId } } },
      });
      const updateReceiver = prisma.user.update({
        where: { id: receiverId },
        data: { incomingRequests: { disconnect: { id: senderId } } },
      });
      await prisma.$transaction([updateSender, updateReceiver]);
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async removeFromFriends({ userId, userFriendId }: { userId: string; userFriendId: string }) {
    try {
      const isUserHasTheFriend = Boolean(
        await prisma.user.findUnique({
          where: {
            id: userId,
            friends: { some: { id: userFriendId } },
          },
        })
      );

      if (!isUserHasTheFriend) {
        throw new BadRequestError("There isn't this user, or the user hasn't this friend.");
      }

      const updateUser = prisma.user.update({
        where: { id: userId },
        data: {
          friends: { disconnect: { id: userFriendId } },
          friendOf: { disconnect: { id: userFriendId } },
        },
      });
      const updateFriend = prisma.user.update({
        where: { id: userFriendId },
        data: {
          friends: { disconnect: { id: userId } },
          friendOf: { disconnect: { id: userId } },
        },
      });
      await prisma.$transaction([updateUser, updateFriend]);
    } catch (err) {
      prismaErrorHandler(err);
    }
  }
}

export const usersService = new UsersService();
