export type Entities = 'user';

export type ErrorResponse = {
  ok: false;
  status: number;
  message: string;
  issues?: string[];
};

export type SuccessResponse = {
  ok: true;
  data?: unknown;
};
