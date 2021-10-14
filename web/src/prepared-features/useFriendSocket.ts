import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { getSocketInstance } from './getSocketInstance';

export const useFriendSocket = () => {
  const queryClient = useQueryClient();
  const me = queryClient.getQueryData<{ id: string }>('me')!;

  useEffect(() => {
    const socket = getSocketInstance();

    socket.emit('joinUser', me.id);
    socket.on('add_friend', (newFriend) => {});

    socket.on('remove_friend', (friend) => {});

    socket.on('toggle_offline', (user) => {});

    socket.on('toggle_online', (user) => {});
  }, []);
};
