import express from 'express';
import path from 'path';
import { getDirname } from './helpers/index.ts';
import { authRouter } from './routers/index.ts';

const __dirname = getDirname(import.meta.url);

export const app = express();

app.use('/static', express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(authRouter);
