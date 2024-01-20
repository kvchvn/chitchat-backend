import { prisma } from '../db';
import { NotFoundError } from '../errors/app-errors';
import { prismaErrorHandler } from '../errors/prisma-error-handler';
import { Nullable } from '../types/global';
import { UsersCategoriesCount } from '../types/responses';

class UsersService {
  private userSelect: {
    id: boolean;
    name: boolean;
    email: boolean;
    image: boolean;
    sessions: { orderBy: { expires: 'desc' }; select: { expires: true } };
  };

  constructor() {
    this.userSelect = {
      id: true,
      name: true,
      email: true,
      image: true,
      sessions: { orderBy: { expires: 'desc' }, select: { expires: true } },
    };
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
              users: { select: this.userSelect },
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
        orderBy: { name: 'asc' },
      });
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async getCategoriesCount(id: string) {
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

      const counts: Nullable<UsersCategoriesCount> = restCategoriesCount
        ? {
            all: allUsersCount,
            friends: restCategoriesCount._count.friends,
            incomingRequests: restCategoriesCount._count.incomingRequests,
            outcomingRequests: restCategoriesCount._count.outcomingRequests,
          }
        : null;

      return counts;
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async getUserFriends(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          friends: {
            select: this.userSelect,
            orderBy: { name: 'asc' },
          },
        },
      });

      if (!user) {
        throw new NotFoundError('user', { id });
      }

      return user.friends;
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async getOutcomingRequests(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          outcomingRequests: {
            select: this.userSelect,
            orderBy: { name: 'asc' },
          },
        },
      });

      if (!user) {
        throw new NotFoundError('user', { id });
      }

      return user.outcomingRequests;
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async getIncomingRequests(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          incomingRequests: {
            select: this.userSelect,
            orderBy: { name: 'asc' },
          },
        },
      });

      if (!user) {
        throw new NotFoundError('user', { id });
      }

      return user.incomingRequests;
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async getUsersSessions(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { sessions: true },
      });

      if (!user) {
        throw new NotFoundError('user', { id });
      }

      return user.sessions;
    } catch (err) {
      prismaErrorHandler(err);
    }
  }

  async removeUsersSessions({ userId, sessionIds }: { userId: string; sessionIds: string[] }) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { sessions: { deleteMany: { id: { in: sessionIds } } } },
      });
    } catch (err) {
      prismaErrorHandler(err);
    }
  }
}

export const usersService = new UsersService();
