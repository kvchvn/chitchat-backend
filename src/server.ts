import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { errorHandler } from './errors/error-handler';
import { unsupportedRoutesHandler } from './errors/unsupported-routes-handler';
import { BaseSocketListener } from './listeners/base-socket-listener';
import { socketMiddleware } from './middlewares/socket-middleware';
import { chatsRouter } from './routers/chats-router';
import { usersRouter } from './routers/users-router';
import { ClientToServerEvents, ServerToClientEvents } from './types/socket';

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
app.use('/users', usersRouter);
app.use('/chats', chatsRouter);
app.use('/', unsupportedRoutesHandler);
app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log('Server is running on port 5000');
});
