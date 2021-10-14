import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { em } from '../mikro-orm.config';

export const initWsServer = (server: HttpServer) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    socket.on('joinUser', async (userId) => {
      socket.join(userId);
      const friendIds = await em.getConnection('read').execute(
        `
				select "User__friends".id from users
				join friends on users."id" = friends."user" 
				join users "User__friends" on friends."friend" = "User__friends"."id"
				where users."id" = ?
			`,
        [userId]
      );

      friendIds.forEach((i) => {
        const id = i['id'];
        socket.to(id).emit('toggle_online', userId);
      });
    });

    socket.on('offline', async (userId) => {
      const friendIds = await em.getConnection('read').execute(
        `
				select "User__friends".id from users
				join friends on users."id" = friends."user" 
				join users "User__friends" on friends."friend" = "User__friends"."id"
				where users."id" = ?
			`,
        [userId]
      );

      friendIds.forEach((i) => {
        const id = i['id'];
        socket.to(id).emit('toggle_offline', userId);
      });
    });

    socket.on('send_message', (id, message) => {
      socket.to(id).emit('send_message', message);
    });

    socket.on('delete_message', (userId, messageId) => {
      socket.to(userId).emit('delete_message', messageId);
    });

    socket.on('add_friend', (toId, user) => {
      socket.to(toId).emit('add_friend', user);
    });

    socket.on('remove_friend', (toId, user) => {
      socket.to(toId).emit('remove_friend', user);
    });

    socket.on('request_friend', (toId, user) => {
      socket.to(toId).emit('request_friend', user);
    });
  });
};
