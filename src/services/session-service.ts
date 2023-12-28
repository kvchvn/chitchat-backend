import { prisma } from '../db';
import { NotFoundError } from '../errors/app-errors';
import { prismaErrorHandler } from '../errors/prisma-error-handler';

class SessionService {
  async getSessionByToken(sessionToken: string) {
    try {
      const sessions = await prisma.session.findMany({
        where: { sessionToken },
      });

      const [session] = sessions;

      if (!session || sessions.length > 1) {
        throw new NotFoundError('session', {}, 'Session is not found or not allowed.');
      }

      return session;
    } catch (err) {
      prismaErrorHandler(err);
    }
  }
}

export const sessionService = new SessionService();
