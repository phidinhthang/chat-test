import { useQueryClient, useMutation } from 'react-query';
import { client } from '../client';
import { User } from '../response/User';

const cancelFriendRequestFn = (id: string) =>
  client.post<{ otherId: string }, boolean>('/cancelRequest', { otherId: id });

export const useCancelFriendRequest = () => {
  const queryClient = useQueryClient();
  const {
    mutate: cancel,
    isLoading: isCancelling,
    ...rest
  } = useMutation(cancelFriendRequestFn, {
    onSuccess: (data, id) => {
      if (data) {
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

  return { cancel, isCancelling, ...rest };
};
