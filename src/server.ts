import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { errorHandler, unsupportedRoutesHandler } from './errors';
import { usersRouter } from './routers';

const PORT = Number(process.env.PORT) || 5000;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

app.use(express.json());

const onConnection = (socket: Socket) => {
  console.log('Socket.io server is connected: ', socket.id);
  // TODO: register handlers here

  socket.on('disconnect', () => {
    console.log('Socket is disconnected: ', socket.id);
  });
};

io.on('connection', onConnection);

app.use('/users', usersRouter);
app.use('/', unsupportedRoutesHandler);
app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log('Server is running on port 5000');
});
