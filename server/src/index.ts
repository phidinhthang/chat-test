import 'reflect-metadata';
import { config } from 'dotenv';
config();
import './mikro-orm.config';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { userRoute } from './routes/userRoute';

(async () => {
  const app = express();
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser());

  app.use('/', userRoute);

  app.listen(process.env.PORT || 4000, () =>
    console.log('server running on port 3000')
  );
})().catch((err) => console.log(err));
