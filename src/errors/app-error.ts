import { StatusCodes } from 'http-status-codes';
import { AppError, AppErrorSpecified } from '../types/common.ts';

export class NotFoundError extends Error {
  readonly status: number;

  constructor(_arg: string);

  constructor(_arg: AppErrorSpecified);

  constructor(arg: string | AppErrorSpecified) {
    super(
      typeof arg === 'string'
        ? arg
        : `There is no ${arg.entity} with these params: ${JSON.stringify(arg.params)}`
    );
    this.status = StatusCodes.NOT_FOUND;
  }
}

export class BadRequest extends Error {
  readonly status: number;

  constructor(message: string) {
    super(message);

    this.status = StatusCodes.BAD_REQUEST;
  }
}

export class ValidationError extends Error {
  readonly status: number;

  readonly issues?: AppError['issues'];

  constructor(message: string, issues: AppError['issues']) {
    super(message);

    this.status = StatusCodes.BAD_REQUEST;
    this.issues = issues;
  }
}
