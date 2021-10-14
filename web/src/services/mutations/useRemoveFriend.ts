import { useMutation, useQueryClient } from 'react-query';
import { client } from '../client';

const removeFriendFn = (id: string) =>
  client.post<{ otherId: string }, boolean>('/removeFriend', { otherId: id });

export const useRemoveFriend = () => {
  const queryClient = useQueryClient();
  const { mutate: removeFriend, ...rest } = useMutation(removeFriendFn, {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries('friends');
    },
  });

  return { removeFriend, ...rest };
};
