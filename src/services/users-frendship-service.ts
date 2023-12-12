import { prisma } from '../db';
import { BadRequestError, NotFoundError } from '../errors/app-errors';
import { prismaErrorHandler } from '../errors/prisma-error-handler';

class UsersFriendshipService {
  async sendFriendRequest({
    requestSenderId,
    requestReceiverId,
  }: {
    requestSenderId: string;
    requestReceiverId: string;
  }) {
    try {
      const isRequestAlreadySent = Boolean(
        await prisma.user.findUnique({
          where: {
            id: requestSenderId,
            OR: [
              { outcomingRequests: { some: { id: requestReceiverId } } },
              { incomingRequests: { some: { id: requestReceiverId } } },
              { friends: { some: { id: requestReceiverId } } },
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
        where: { id: requestSenderId },
        data: { outcomingRequests: { connect: { id: requestReceiverId } } },
        select: {
          _count: {
            select: {
              outcomingRequests: { where: { id: requestReceiverId } },
            },
          },
        },
      });

      return updatedSender;
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async cancelFriendRequest({
    requestSenderId,
    requestReceiverId,
  }: {
    requestSenderId: string;
    requestReceiverId: string;
  }) {
    try {
      const isRequestExisted = Boolean(
        await prisma.user.findUnique({
          where: {
            id: requestSenderId,
            outcomingRequests: { some: { id: requestReceiverId } },
          },
        })
      );

      if (!isRequestExisted) {
        throw new BadRequestError(
          `Friend request between the sender and the receiver doesn't exist`
        );
      }

      const updatedSender = await prisma.user.update({
        where: { id: requestSenderId },
        data: {
          outcomingRequests: { disconnect: { id: requestReceiverId } },
        },
        select: {
          _count: {
            select: {
              outcomingRequests: { where: { id: requestReceiverId } },
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
        data: {
          outcomingRequests: { disconnect: { id: requestReceiverId } },
          friends: { connect: { id: requestReceiverId } },
        },
      });

      const updateRequestReceiverPromise = prisma.user.update({
        where: { id: requestReceiverId },
        data: {
          incomingRequests: { disconnect: { id: requestSenderId } },
          friends: { connect: { id: requestSenderId } },
        },
        select: {
          _count: {
            select: {
              friends: { where: { id: requestSenderId } },
              incomingRequests: { where: { id: requestSenderId } },
            },
          },
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
        data: { incomingRequests: { disconnect: { id: requestSenderId } } },
        select: {
          _count: {
            select: {
              friends: { where: { id: requestSenderId } },
              incomingRequests: { where: { id: requestSenderId } },
            },
          },
        },
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
        select: {
          _count: {
            select: {
              friends: { where: { id: userId } },
            },
          },
        },
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

export const usersFriendshipService = new UsersFriendshipService();
