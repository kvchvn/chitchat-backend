import { prisma } from '../db';

class UsersService {
  async getAllUsersExceptOneself(userId: string) {
    return await prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },
      },
    });
  }

  async getUserFriendsAndRequests(userId: string) {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        friends: true,
        incomingRequests: true,
        outcomingRequests: true,
      },
    });
  }

  async sendFriendRequest(senderId: string, receiverId: string) {
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
    await prisma.$transaction([updateSender, updateReceiver]);
  }

  async acceptFriendRequest(senderId: string, receiverId: string) {
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
  }

  async cancelFriendRequest(senderId: string, receiverId: string) {
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
  }
}

export const usersService = new UsersService();
