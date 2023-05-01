import * as dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

dotenv.config({
  path: path.join(__dirname, '../.env'),
});

const { PORT } = process.env;

const app = express();

app.use('/static', express.static(path.join(__dirname, '../public')));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server listens on ${PORT} port`);
});
