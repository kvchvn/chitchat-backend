import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

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

io.on('connection', (socket) => {
  console.log('Socket.io is connected: ', socket.id);
});

httpServer.listen(PORT, () => {
  console.log('Server is running on port 5000');
});
