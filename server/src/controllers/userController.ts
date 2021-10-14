import { Request, Response } from 'express';
import { v4 } from 'uuid';
import { User } from '../entities/User';
import { em } from '../mikro-orm.config';
import argon2 from 'argon2';
import { sendRefreshToken } from '../utils/sendRefreshToken';
import { createRefreshToken } from '../utils/createRefreshToken';
import { createAccessToken } from '../utils/createAccessToken';
import { getUserId } from '../utils/getUserId';
import { Conversation } from '../entities/Conversation';
import { redis } from '../prepared-features/initRedis';
import { ADD_EMAIL_PREFIX, FORGET_PASSWORD_PREFIX } from '../utils/constants';
import { sendMail } from '../prepared-features/sendMail';

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

  const user = await em.fork().findOne(
    User,
    {
      id: userId,
    },
    { fields: ['id', 'username'] }
  );

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

  let conversation = await em.findOne(Conversation, {
    $or: [
      {
        ownerOne: userId,
        ownerTwo: otherId,
      },
      {
        ownerOne: otherId,
        ownerTwo: userId,
      },
    ],
  });

  if (!conversation) {
    console.log('create new conversation');
    const user = await em.findOneOrFail(User, userId);
    const other = await em.findOneOrFail(User, otherId);
    conversation = em.create(Conversation, {
      ownerOne: user,
      ownerTwo: other,
    });
  }

  await em.persistAndFlush([user, other, conversation]);

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

/** upcoming controller */
export const uploadAvatar = async (req: Request, res: Response) => {
  const { avatarUrl }: { avatarUrl: string } = req.body;
  const userId = getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: 'token expired.' });
  }
  const user = await em.findOneOrFail(User, { id: userId });

  user.avatarUrl = avatarUrl;
  await em.persistAndFlush(user);
  return res.status(200).send(true);
};

export const changePassword = async (req: Request, res: Response) => {
  const { password, newPassword }: { password: string; newPassword: string } =
    req.body;
  const userId = getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: 'token expired.' });
  }
  const user = await em.findOneOrFail(User, { id: userId });
  const match = await argon2.verify(user.password, password);

  if (!match) res.status(400).json({ message: 'Old password do not correct' });

  const hashedPassword = await argon2.hash(newPassword);

  user.password = hashedPassword;

  await em.persistAndFlush(user);

  return res.status(200).send(true);
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email }: { email: string } = req.body;

  const user = await em.findOne(User, { email });
  if (!user) {
    return res.status(200).send(true);
  }

  const token = v4();

  await redis.set(
    FORGET_PASSWORD_PREFIX + token,
    user.id,
    'ex',
    1000 * 60 * 60 * 24 * 3
  );

  await sendMail(
    email,
    `<a href="http://localhost:3000/change-password/${token}">Doi mat khau</a>`
  );

  return res.status(200).send(true);
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword }: { token: string; newPassword: string } =
    req.body;

  if (newPassword.length < 4) {
    return res.status(200).json({
      errors: [
        { field: 'password', message: 'Password must have at least 4 char' },
      ],
    });
  }

  const key = FORGET_PASSWORD_PREFIX + token;
  const userId = await redis.get(key);
  if (!userId) {
    return res.status(500).json({
      errors: [
        {
          field: 'token',
          message: 'Có lỗi xảy ra. Vui lòng thử lại.!',
        },
      ],
    });
  }

  const user = await em.findOne(User, { id: userId });
  if (!user) {
    return res.status(400).json({
      errors: [
        {
          field: 'token',
          message: 'Tài khoản này không tồn tại.',
        },
      ],
    });
  }

  user.password = await argon2.hash(newPassword);
  await redis.del(key);
  await em.persistAndFlush(user);

  sendRefreshToken(res, createRefreshToken(user));

  return res.status(200).json({ user, accessToken: createAccessToken(user) });
};

export const addEmail = async (req: Request, res: Response) => {
  const { email }: { email: string } = req.body;

  const userId = getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: 'token expired.' });
  }
  const user = await em.findOneOrFail(User, { id: userId });

  const emailExisted = await em.findOne(User, {
    email,
  });

  if (emailExisted && emailExisted.id !== user.id) return false;

  const token = v4();

  try {
    await redis.set(
      ADD_EMAIL_PREFIX + token,
      `${user.id}:${email}`,
      'ex',
      1000 * 60 * 60 * 24 * 3
    );

    await sendMail(
      email,
      `<a href="http://localhost:3000/confirm-email/${token}">Xác nhận Email</a>`
    );
  } catch (err) {
    console.log('abcdef ', err);
  }
  return res.status(200).send(true);
};

export const confirmEmail = async (req: Request, res: Response) => {
  const { token }: { token: string } = req.body;
  const key = await redis.get(ADD_EMAIL_PREFIX + token);
  if (!key) {
    return res.status(400).send(false);
  }

  const [userId, email] = key.split(':');
  const user = await em.findOneOrFail(User, userId);
  user.email = email;
  await em.persistAndFlush(user);

  return res.status(200).send(true);
};
