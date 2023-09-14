import { prisma } from '../db';
import { prismaErrorHandler } from '../errors';

class UsersService {
  async getAllUsersExceptOneself(userId: string) {
    try {
      return await prisma.user.findMany({
        where: {
          id: {
            not: userId,
          },
        },
      });
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async getUserFriendsAndRequests(userId: string) {
    try {
      return await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          friends: true,
          incomingRequests: true,
          outcomingRequests: true,
        },
      });
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async sendFriendRequest(senderId: string, receiverId: string) {
    try {
      const updateSender = prisma.user.update({
        where: { id: senderId },
        data: {
          outcomingRequests: { connect: { id: receiverId } },
        },
      });
      const updateReceiver = prisma.user.update({
        where: { id: receiverId },
        data: {
          incomingRequests: { connect: { id: senderId } },
        },
      });
      return await prisma.$transaction([updateSender, updateReceiver]);
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async acceptFriendRequest(senderId: string, receiverId: string) {
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

  async cancelFriendRequest(senderId: string, receiverId: string) {
    try {
      const updateSender = prisma.user.update({
        where: { id: senderId },
        data: {
          outcomingRequests: { disconnect: { id: receiverId } },
        },
      });
      const updateReceiver = prisma.user.update({
        where: { id: receiverId },
        data: {
          incomingRequests: { disconnect: { id: senderId } },
        },
      });
      await prisma.$transaction([updateSender, updateReceiver]);
    } catch (err) {
      prismaErrorHandler(err);
    }
  }
}

export const usersService = new UsersService();
