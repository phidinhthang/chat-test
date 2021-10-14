import { useMutation, useQueryClient } from 'react-query';
import { client } from '../client';

const acceptFriendRequestFn = (id: string) =>
  client.post<{ otherId: string }, boolean>('/acceptRequest', { otherId: id });

export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();
  const {
    mutate: accept,
    isLoading: isAccepting,
    ...rest
  } = useMutation(acceptFriendRequestFn, {
    onSuccess: (data, id) => {
      queryClient.invalidateQueries('friends');
      queryClient.invalidateQueries('pendings');
    },
  });

  return { accept, isAccepting, ...rest };
};
