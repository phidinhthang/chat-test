import { useMutation, useQueryClient } from 'react-query';
import { client } from '../client';
import { User } from '../response/User';

const removeFriendFn = (id: string) =>
  client.post<{ otherId: string }, boolean>('/removeFriend', { otherId: id });

export const useRemoveFriend = () => {
  const queryClient = useQueryClient();
  const { mutate: removeFriend, ...rest } = useMutation(removeFriendFn, {
    onSuccess: (data, variables) => {
      if (data) {
        queryClient.setQueryData<{ friends: User[] } | undefined>(
          'friends',
          (friends) => {
            if (friends?.friends && Array.isArray(friends.friends)) {
              return {
                friends: friends.friends.filter((f) => f.id !== variables),
              };
            }
            return friends;
          }
        );
      }
    },
  });

  return { removeFriend, ...rest };
};
