import mongoose from 'mongoose';
import { app } from './app.ts';
import { MONGO_CONNECTION_URL, PORT } from './common/config.ts';

mongoose.connect(MONGO_CONNECTION_URL as string);

const db = mongoose.connection;

db.on('error', () => {
  console.log('Connection to MongoDB failed.');
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT} port`);
  });
});
