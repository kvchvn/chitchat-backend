import express from 'express';
import path from 'path';
import { NotFoundError } from './errors/app-error.ts';
import { errorMiddleware } from './errors/error-middleware.ts';
import { getDirname } from './helpers/index.ts';
import { authRouter } from './resources/auth/auth.router.ts';
import { userRouter } from './resources/user/user.router.ts';

const __dirname = getDirname(import.meta.url);

export const app = express();

app.use('/static', express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use('/auth', authRouter);
app.use('/users', userRouter);

// for rest unsupported requests
app.use((_req, _res, next) => {
  const err = new NotFoundError('This endpoint or/and method are not supported.');
  next(err);
});

app.use(errorMiddleware);
