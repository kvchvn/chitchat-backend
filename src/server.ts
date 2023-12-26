import dotenv from 'dotenv';
dotenv.config();

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { BaseSocketListener } from './listeners/base-socket-listener';
import { authorization } from './middlewares/http/authorization';
import { errorHandling } from './middlewares/http/error-handling';
import { unsupportedRoutesHandling } from './middlewares/http/unsupported-routes-handling';
import { expiredSessionsCleaning } from './middlewares/socket/expired-sessions-cleaning';
import { sessionChecking } from './middlewares/socket/session-checking';
import { userChatsJoining } from './middlewares/socket/user-chats-joining';
import { chatsRouter } from './routers/chats-router';
import { usersRouter } from './routers/users-router';
import { ClientToServerEvents, ServerToClientEvents } from './types/socket';

const PORT = Number(process.env.PORT) || 5000;

const app = express();
const httpServer = createServer(app);
app.use(cookieParser());

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// socket middlewares
io.use(sessionChecking);
io.use(userChatsJoining);
io.use(expiredSessionsCleaning);

io.on('connection', (socket) => {
  new BaseSocketListener(io, socket).registerAllListeners();
});

httpServer.on('close', () => {
  io.disconnectSockets();
});

// http-server middlewares
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(authorization);
app.use('/users', usersRouter);
app.use('/chats', chatsRouter);
app.use('/', unsupportedRoutesHandling);
app.use(errorHandling);

httpServer.listen(PORT, () => {
  console.log('Server is running on port 5000');
});

process.on('exit', () => {
  httpServer.close();
});
