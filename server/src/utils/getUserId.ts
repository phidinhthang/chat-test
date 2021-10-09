import { Request } from 'express';
import jwt from 'jsonwebtoken';

export const getUserId = (req: Request): string | undefined => {
  const authorization = req.headers['authorization'];

  if (!authorization) return undefined;
  try {
    const token = authorization.split(' ')[1];

    const payload: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    const userId = payload?.userId;
    return userId;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};
