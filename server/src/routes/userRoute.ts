import { verify } from 'jsonwebtoken';
import { Router } from 'express';
import * as controller from '../controllers/userController';
import { em } from '../mikro-orm.config';
import { User } from '../entities/User';
import { createAccessToken } from '../utils/createAccessToken';

const route = Router();

route.post('/register', controller.register);
route.post('/login', controller.login);
route.post('/logout', controller.logout);
route.get('/me', controller.getMe);
route.post('/sendRequest', controller.sendFriendRequest);
route.post('/cancelRequest', controller.cancelFriendRequest);
route.get('/friends', controller.getFriends);
route.get('/pending', controller.getPendingFriendRequests);
route.post('/acceptRequest', controller.acceptFriendRequest);
route.post('/removeFriend', controller.removeFriend);
route.get('/users', controller.getAllUsers);

route.post('/refresh_token', async (req, res) => {
  const token = req.cookies?.jid;
  console.log('token ', token);
  if (!token) {
    return res.send({ ok: false, accessToken: '' });
  }

  let payload: any = null;

  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
  } catch (err) {
    console.log(err);
    return res.send({ ok: false, accessToken: '' });
  }

  const user = await em.findOne(User, { id: payload.userId });

  if (!user) {
    return res.send({ ok: false, accessToken: '' });
  }

  return res.send({ ok: true, accessToken: createAccessToken(user) });
});

export { route as userRoute };
