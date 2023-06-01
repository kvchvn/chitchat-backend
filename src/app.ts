import express from 'express';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
import { REQUEST_NOT_ALLOWED } from './constants/index.ts';
import { getDirname } from './helpers/index.ts';
import { authRouter } from './routers/index.ts';

const __dirname = getDirname(import.meta.url);

export const app = express();

app.use('/static', express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(authRouter);

app.all('*', (_, res) => res.status(StatusCodes.NOT_FOUND).send(REQUEST_NOT_ALLOWED));
