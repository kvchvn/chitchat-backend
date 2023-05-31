import dotenv from 'dotenv';
import path from 'path';
import { getDirname } from '../helpers/index.ts';

const __dirname = getDirname(import.meta.url);

dotenv.config({
  path: path.join(__dirname, '../../.env'),
});

export const { PORT, MONGO_CONNECTION_URL } = process.env;
