import { StatusCodes } from 'http-status-codes';
import { ZodIssue } from 'zod';
import { Entities } from '../types/global';

export class AppError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  readonly status: number;

  constructor(entity: Entities, params: Record<string, unknown>, message?: string) {
    let stringifiedParams = '';
    try {
      stringifiedParams = JSON.stringify(params);
    } catch (err) {
      console.log(err);
    }
    super(message || `There is no ${entity} with params: ${stringifiedParams}.`);
    this.status = StatusCodes.NOT_FOUND;
  }
}

export class BadRequestError extends AppError {
  readonly status: number;

  constructor(message: string) {
    super(message);
    this.status = StatusCodes.BAD_REQUEST;
  }
}

export class MethodNotAllowedError extends AppError {
  readonly status: number;

  constructor() {
    super('Method not allowed.');
    this.status = StatusCodes.METHOD_NOT_ALLOWED;
  }
}

export class ValidationError extends AppError {
  readonly status: number;
  readonly issues: string[];

  constructor(issues: ZodIssue[]) {
    super('Validation Error');
    this.issues = issues.map((issue) => `${issue.message} in ${issue.path.join('.')}`);
    this.status = StatusCodes.UNPROCESSABLE_ENTITY;
  }
}
