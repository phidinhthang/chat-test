import { useEffect } from 'react';
import { getSocketInstance } from './getSocketInstance';
import { InfiniteData, useQueryClient } from 'react-query';

/** dont know key yet */
export const useMessageSocket = (key: string) => {
  const queryClient = useQueryClient();
  const me = queryClient.getQueryData('me')!;

  useEffect(() => {
    const socket = getSocketInstance();
    socket.on('send_message', (message) => {
      queryClient.setQueryData<InfiniteData<{ id: string; text: string }[]>>(
        key,
        (d) => {
          d!.pages[0].unshift(message);
          return d!;
        }
      );
    });

    socket.on('delete_message', (message: { id: string; text: string }) => {
      queryClient.setQueryData<InfiniteData<{ id: string; text: string }[]>>(
        key,
        (d) => {
          let index = -1;
          d!.pages.forEach((p, i) => {
            if (p.findIndex((m) => m.id === message.id) !== -1) index = i;
          });
          if (index !== -1)
            d!.pages[index] = d!.pages[index].filter(
              (m) => m.id !== message.id
            );
          return d!;
        }
      );
    });

    return () => {
      socket.off('delete_message');
      socket.off('send_message');
    };
  }, [me, queryClient, key]);
};
