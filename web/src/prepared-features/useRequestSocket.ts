import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { getSocketInstance } from './getSocketInstance';

export function useRequestSocket() {
  const queryClient = useQueryClient();
  const me = queryClient.getQueryData('me')!;

  useEffect(() => {
    const socket = getSocketInstance();
    socket.on('add_request', (newRequest) => {
      queryClient.setQueryData('pendings', (data) => {
        return [...data!, newRequest];
      });
    });

    return () => {
      socket.off('add_request');
    };
  }, [queryClient, me]);
}
