export type AppError = {
  status: number;
  message: string;
  issues?: Record<string, string>;
};

export type AppErrorSpecified = {
  entity: 'user' | 'chat';
  params: Record<string, string>;
};
