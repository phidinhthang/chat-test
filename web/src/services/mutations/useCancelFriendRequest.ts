import { useQueryClient, useMutation } from 'react-query';
import { client } from '../client';

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
      queryClient.invalidateQueries('pendings');
    },
  });

  return { cancel, isCancelling, ...rest };
};
