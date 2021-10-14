import { useMutation, useQueryClient } from 'react-query';
import { client } from '../client';

const sendRequestFn = (id: string) =>
  client.post<{ otherId: string }, boolean>('/sendRequest', { otherId: id });

export const useSendRequest = () => {
  const queryClient = useQueryClient();
  const { mutate: sendRequest, ...rest } = useMutation(sendRequestFn, {
    onSuccess: (data, id) => {
      queryClient.invalidateQueries('pendings');
    },
  });
  return { sendRequest, ...rest };
};
