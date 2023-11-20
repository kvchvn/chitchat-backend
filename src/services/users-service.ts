import { prisma } from '../db';
import { BadRequestError, NotFoundError } from '../errors/app-errors';
import { prismaErrorHandler } from '../errors/prisma-error-handler';
import { Nullable } from '../types/global';
import { UsersCategories } from '../types/responses';

class UsersService {
  private userSelect: { id: boolean; name: boolean; email: boolean; image: boolean };

  constructor() {
    this.userSelect = { id: true, name: true, email: true, image: true };
  }

  async getUser(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: this.userSelect,
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
                select: this.userSelect,
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
        throw new NotFoundError(`user`, { id });
      }

      return user.chats;
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async getAllUsersWithRelationsToCurrentUser(id: string) {
    try {
      return await prisma.user.findMany({
        select: {
          ...this.userSelect,
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

  async getCategoriesCounts(id: string) {
    try {
      const allUsersCountPromise = prisma.user.count();
      const restCategoriesCountsPromise = prisma.user.findUnique({
        where: { id },
        select: {
          _count: {
            select: {
              friends: true,
              incomingRequests: true,
              outcomingRequests: true,
            },
          },
        },
      });

      const [allUsersCount, restCategoriesCount] = await Promise.all([
        allUsersCountPromise,
        restCategoriesCountsPromise,
      ]);

      const counts: { [Property in UsersCategories]: Nullable<number> } = {
        all: allUsersCount,
        friends: restCategoriesCount?._count.friends ?? null,
        incomingRequests: restCategoriesCount?._count.incomingRequests ?? null,
        outcomingRequests: restCategoriesCount?._count.outcomingRequests ?? null,
      };

      return counts;
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async getUserFriends(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { friends: { select: this.userSelect } },
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
        select: { outcomingRequests: { select: this.userSelect } },
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
        select: { incomingRequests: { select: this.userSelect } },
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
      const isRequestAlreadySent = Boolean(
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

      if (isRequestAlreadySent) {
        throw new BadRequestError(
          'Friend request between the sender and the receiver exists (or has been accepted already)'
        );
      }

      const updatedSender = await prisma.user.update({
        where: { id: senderId },
        data: { outcomingRequests: { connect: { id: receiverId } } },
        select: {
          ...this.userSelect,
          _count: {
            select: {
              friends: { where: { id: senderId } },
              incomingRequests: { where: { id: senderId } },
              outcomingRequests: { where: { id: senderId } },
            },
          },
        },
      });

      return updatedSender;
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async acceptFriendRequest({
    requestSenderId,
    requestReceiverId,
  }: {
    requestSenderId: string;
    requestReceiverId: string;
  }) {
    try {
      const updateRequestSenderPromise = prisma.user.update({
        where: { id: requestSenderId },
        select: this.userSelect,
        data: {
          outcomingRequests: { disconnect: { id: requestReceiverId } },
          friends: { connect: { id: requestReceiverId } },
        },
      });

      const updateRequestReceiverPromise = prisma.user.update({
        where: { id: requestReceiverId },
        select: this.userSelect,
        data: {
          incomingRequests: { disconnect: { id: requestSenderId } },
          friends: { connect: { id: requestSenderId } },
        },
      });

      const createOrEnableCommonChatPromise = prisma.chat
        .updateMany({
          where: { users: { every: { id: { in: [requestReceiverId, requestSenderId] } } } },
          data: { isDisabled: false },
        })
        .then(({ count: commonChatCount }) => {
          if (!commonChatCount) {
            prisma.chat.create({
              data: {
                users: { connect: [{ id: requestSenderId }, { id: requestReceiverId }] },
              },
            });
          }
        });

      const [_, updatedRequestReceiver] = await Promise.all([
        updateRequestSenderPromise,
        updateRequestReceiverPromise,
        createOrEnableCommonChatPromise,
      ]);

      return updatedRequestReceiver;
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async refuseFriendRequest({
    requestSenderId,
    requestReceiverId,
  }: {
    requestSenderId: string;
    requestReceiverId: string;
  }) {
    try {
      const updatedRequestReceiver = await prisma.user.update({
        where: { id: requestReceiverId },
        select: this.userSelect,
        data: { incomingRequests: { disconnect: { id: requestSenderId } } },
      });

      return updatedRequestReceiver;
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async removeFromFriends({ userId, friendId }: { userId: string; friendId: string }) {
    try {
      const hasUserTheFriend = Boolean(
        await prisma.user.findUnique({
          where: {
            id: userId,
            friends: { some: { id: friendId } },
          },
        })
      );

      if (!hasUserTheFriend) {
        throw new NotFoundError('user', { id: userId, friends: [{ id: friendId }] });
      }

      const updateUserPromise = prisma.user.update({
        where: { id: userId },
        select: this.userSelect,
        data: {
          friends: { disconnect: { id: friendId } },
          friendOf: { disconnect: { id: friendId } },
        },
      });

      const disableCommonChatPromise = prisma.chat.updateMany({
        where: {
          AND: [{ users: { some: { id: userId } } }, { users: { some: { id: friendId } } }],
        },
        data: { isDisabled: true },
      });

      const [updatedUser] = await Promise.all([updateUserPromise, disableCommonChatPromise]);

      return updatedUser;
    } catch (err) {
      prismaErrorHandler(err);
    }
  }
}

export const usersService = new UsersService();
