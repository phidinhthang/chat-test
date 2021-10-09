import { Request, Response } from 'express';
import { v4 } from 'uuid';
import { User } from '../entities/User';
import { em } from '../mikro-orm.config';
import argon2 from 'argon2';
import { sendRefreshToken } from '../utils/sendRefreshToken';
import { createRefreshToken } from '../utils/createRefreshToken';
import { createAccessToken } from '../utils/createAccessToken';
import { getUserId } from '../utils/getUserId';

export const register = async (req: Request, res: Response) => {
  const { username, password }: { username: string; password: string } =
    req.body;

  console.log(username, password);

  const existed = await em.findOne(User, { username });

  if (existed) {
    return res
      .status(400)
      .json({ field: 'username', message: 'username already exist.' });
  }

  const user = em.create(User, {
    id: v4(),
    username,
    password: await argon2.hash(password),
  });

  await em.persistAndFlush(user);

  sendRefreshToken(res, createRefreshToken(user));

  return res.status(200).json({ user, accessToken: createAccessToken(user) });
};

export const login = async (req: Request, res: Response) => {
  const { username, password }: { username: string; password: string } =
    req.body;

  const user = await em.findOne(User, { username });

  if (!user) {
    return res
      .status(403)
      .json({ field: 'username', message: 'Invalid credentials' });
  }

  const isValid = await argon2.verify(user.password, password);

  if (!isValid) {
    return res
      .status(403)
      .json({ field: 'password', message: 'Invalid password.' });
  }

  sendRefreshToken(res, createRefreshToken(user));

  return res.status(200).json({ user, accessToken: createAccessToken(user) });
};

export const logout = async (_: any, res: Response) => {
  sendRefreshToken(res, '');
  return res.status(200).send(true);
};

export const getMe = async (req: Request, res: Response) => {
  const userId = getUserId(req);

  if (!userId) {
    return res.status(403).json({ message: 'token expired' });
  }

  const user = await em.findOne(User, {
    id: userId,
  });

  return res.status(200).json({ user });
};

export const getAllUsers = async (_: any, res: Response) => {
  const users = await em.createQueryBuilder(User).select('*').getResult();

  return res.status(200).json({ users });
};

export const sendFriendRequest = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { otherId }: { otherId: string } = req.body;
  console.log('senf friend request', otherId);
  if (!userId) {
    return res.status(403).json({ message: 'token expired.' });
  }

  const user = await em.findOneOrFail(User, { id: userId }, [
    'friends',
    'requests',
  ]);
  const other = await em.findOneOrFail(User, { id: otherId });
  const alreadyRequest = !!user.requests
    .getItems()
    .find((request) => request.id === otherId);
  const isFriendBefore = !!user.friends
    .getItems()
    .find((friend) => friend.id === otherId);

  if (alreadyRequest || isFriendBefore) {
    return res.status(200).send(false);
  }
  user.requests.add(other);

  await em.persistAndFlush(user);

  return res.status(200).send(true);
};

export const getFriends = async (req: Request, res: Response) => {
  const userId = getUserId(req);

  if (!userId) {
    return res.status(403).json({ message: 'token expired.' });
  }

  const user = await em.findOneOrFail(User, { id: userId }, ['friends']);

  return res.status(200).json({ friends: user.friends.getItems() });
};

export const getPendingFriendRequests = async (req: Request, res: Response) => {
  const userId = getUserId(req);

  if (!userId) {
    return res.status(403).json({ message: 'token expired.' });
  }
  const pendings = await em.execute<User[]>(
    `
    select u.id, u.username, 1 as "type" from users u
    join users_requests Request on u.id = Request."userId"
    where Request."requestId" = ?
    union
    select u.id, u.username, 0 as "type" from users u
    join users_requests Request on u.id = Request."requestId"
    where Request."userId" = ?
    order by username;
  `,
    [userId, userId]
  );

  return res.status(200).json(pendings);
};

export const acceptFriendRequest = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { otherId }: { otherId: string } = req.body;

  if (!userId) {
    return res.status(403).json({ message: 'token expired.' });
  }

  const user = await em.findOneOrFail(
    User,
    {
      id: userId,
    },
    ['friends']
  );

  const other = await em.findOneOrFail(
    User,
    {
      id: otherId,
    },
    ['requests', 'friends']
  );

  let hasRequest = false;

  other.requests.getItems().forEach((r) => {
    if (r.id === userId) {
      hasRequest = true;
    }
  });

  if (!hasRequest) {
    return res.status(200).send(false);
  }

  user.friends.add(other);
  other.requests.remove(em.getReference(User, user.id));
  other.friends.add(user);
  await em.persistAndFlush([user, other]);

  return res.status(200).send(true);
};

export const cancelFriendRequest = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { otherId }: { otherId: string } = req.body;

  if (!userId) {
    return res.status(403).json({ message: 'token expired.' });
  }

  const user = await em.findOneOrFail(User, { id: userId }, ['requests']);
  const other = await em.findOneOrFail(User, { id: otherId }, ['requests']);

  user.requests.remove(em.getReference(User, other.id));
  other.requests.remove(em.getReference(User, user.id));

  await em.persistAndFlush([user, other]);

  return res.status(200).send(true);
};

export const removeFriend = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { otherId }: { otherId: string } = req.body;
  if (!userId) {
    return res.status(403).json({ message: 'token expired.' });
  }

  const user = await em.findOneOrFail(User, { id: userId });
  const other = await em.findOneOrFail(User, { id: otherId });

  user.friends.remove(em.getReference(User, otherId));
  other.friends.remove(em.getReference(User, userId));
  await em.persistAndFlush([user, other]);

  return res.status(200).send(true);
};
