import Redis from 'ioredis';
import { __isProd__ } from '../utils/constants';

export const redis = new Redis(process.env.REDIS_URL, {
  password: __isProd__ ? process.env.REDIS_PASSWORD : undefined,
});
