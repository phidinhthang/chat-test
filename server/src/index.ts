import 'reflect-metadata';
import { config } from 'dotenv';
config();
import './mikro-orm.config';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { userRoute } from './routes/userRoute';
import { messageRoute } from './routes/messageRoute';
import { RequestContext } from '@mikro-orm/core';
import { em } from './mikro-orm.config';

(async () => {
  const app = express();
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    })
  );
  console.log(process.env.FRONTEND_URL);
  app.use(express.json());
  app.use(cookieParser());

  app.use((_, __, next) => {
    RequestContext.create(em, next);
  });

  app.use('/', userRoute);
  app.use('/messages', messageRoute);

  app.listen(process.env.PORT || 4000, () =>
    console.log('server running on port 3000')
  );
})().catch((err) => console.log(err));
