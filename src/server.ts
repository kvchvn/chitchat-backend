import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { errorHandler, unsupportedRoutesHandler } from './errors';
import { BaseSocketListener } from './listeners';
import { socketMiddleware } from './middlewares';
import { chatRouter, userRouter } from './routers';
import { ClientToServerEvents, ServerToClientEvents } from './types';

const PORT = Number(process.env.PORT) || 5000;

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

io.use(socketMiddleware);
io.on('connection', (socket) => {
  new BaseSocketListener(io, socket).registerAllListeners();
});

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
app.use('/user', userRouter);
app.use('/chat', chatRouter);
app.use('/', unsupportedRoutesHandler);
app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log('Server is running on port 5000');
});
