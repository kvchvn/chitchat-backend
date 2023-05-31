export type ErrorResponse = {
  result: 'error';
  code: number;
  data: {
    message: string;
  };
};
