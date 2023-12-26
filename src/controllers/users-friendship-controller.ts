import { NextFunction, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { usersFriendshipService } from '../services/users-frendship-service';
import { ZodInfer } from '../types/global';
import { UserOperationResponse } from '../types/responses';
import {
  friendRemovingSchema,
  friendRequestResponseSchema,
  friendRequestSchema,
} from '../validation/http/schemas';

class UsersFriendshipController {
  async sendFriendRequest(
    req: Request<
      ZodInfer<typeof friendRequestSchema, 'params'>,
      unknown,
      unknown,
      ZodInfer<typeof friendRequestSchema, 'query'>
    >,
    res: UserOperationResponse,
    next: NextFunction
  ) {
    try {
      const updatedSender = await usersFriendshipService.sendFriendRequest({
        requestSenderId: req.params.id,
        requestReceiverId: req.query.requestReceiverId,
      });

      if (updatedSender) {
        const isRequestSent = Boolean(updatedSender._count.outcomingRequests);
        res.status(StatusCodes.OK).send({ data: { isOperationPerformed: isRequestSent } });
      }
    } catch (err) {
      next(err);
    }
  }

  async cancelFriendRequest(
    req: Request<
      ZodInfer<typeof friendRequestSchema, 'params'>,
      unknown,
      unknown,
      ZodInfer<typeof friendRequestSchema, 'query'>
    >,
    res: UserOperationResponse,
    next: NextFunction
  ) {
    try {
      const updatedSender = await usersFriendshipService.cancelFriendRequest({
        requestSenderId: req.params.id,
        requestReceiverId: req.query.requestReceiverId,
      });

      if (updatedSender) {
        const isRequestCancelled = Boolean(!updatedSender._count.outcomingRequests);
        res.status(StatusCodes.OK).send({ data: { isOperationPerformed: isRequestCancelled } });
      }
    } catch (err) {
      next(err);
    }
  }

  async acceptFriendRequest(
    req: Request<
      ZodInfer<typeof friendRequestResponseSchema, 'params'>,
      unknown,
      unknown,
      ZodInfer<typeof friendRequestResponseSchema, 'query'>
    >,
    res: UserOperationResponse,
    next: NextFunction
  ) {
    try {
      const updatedReceiver = await usersFriendshipService.acceptFriendRequest({
        requestReceiverId: req.params.id,
        requestSenderId: req.query.requestSenderId,
      });

      if (updatedReceiver) {
        const isRequestAccepted = Boolean(
          updatedReceiver._count.friends && !updatedReceiver._count.incomingRequests
        );
        res.status(StatusCodes.OK).send({ data: { isOperationPerformed: isRequestAccepted } });
      }
    } catch (err) {
      next(err);
    }
  }

  async refuseFriendRequest(
    req: Request<
      ZodInfer<typeof friendRequestResponseSchema, 'params'>,
      unknown,
      unknown,
      ZodInfer<typeof friendRequestResponseSchema, 'query'>
    >,
    res: UserOperationResponse,
    next: NextFunction
  ) {
    try {
      const updatedReceiver = await usersFriendshipService.refuseFriendRequest({
        requestReceiverId: req.params.id,
        requestSenderId: req.query.requestSenderId,
      });

      if (updatedReceiver) {
        const isRequestRefused = Boolean(
          !updatedReceiver._count.incomingRequests && !updatedReceiver._count.friends
        );
        res.status(StatusCodes.OK).send({ data: { isOperationPerformed: isRequestRefused } });
      }
    } catch (err) {
      next(err);
    }
  }

  async removeFromFriends(
    req: Request<
      ZodInfer<typeof friendRemovingSchema, 'params'>,
      unknown,
      unknown,
      ZodInfer<typeof friendRemovingSchema, 'query'>
    >,
    res: UserOperationResponse,
    next: NextFunction
  ) {
    try {
      const updatedUser = await usersFriendshipService.removeFromFriends({
        userId: req.params.id,
        friendId: req.query.friendId,
      });

      if (updatedUser) {
        const isFriendRemoved = Boolean(!updatedUser._count.friends);
        res.status(StatusCodes.OK).send({ data: { isOperationPerformed: isFriendRemoved } });
      }
    } catch (err) {
      next(err);
    }
  }
}

export const usersFriendshipController = new UsersFriendshipController();
