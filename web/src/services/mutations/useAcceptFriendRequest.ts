import { useMutation, useQueryClient } from 'react-query';
import { client } from '../client';
import { User } from '../response/User';

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
      if (data) {
        const pendings = queryClient.getQueryData<
          (User & { type: 0 | 1 })[] | undefined
        >('pendings');
        const newFriend = pendings?.find((p) => p.id === id);
        if (!newFriend) return;
        queryClient.setQueryData<{ friends: User[] } | undefined>(
          'friends',
          (friends) => {
            if (friends && Array.isArray(friends?.friends)) {
              return {
                ...friends,
                friends: [
                  ...friends!.friends,
                  {
                    id: newFriend.id,
                    username: newFriend.username,
                    isOnline: false,
                    lastLoginAt: '',
                  },
                ],
              };
            }
            return friends;
          }
        );
        queryClient.setQueryData<(User & { type: 0 | 1 })[] | undefined>(
          'pendings',
          (pendings) => {
            if (Array.isArray(pendings)) {
              return pendings.filter((p) => p.id !== id);
            }
            return pendings;
          }
        );
      }
    },
  });

  return { accept, isAccepting, ...rest };
};
