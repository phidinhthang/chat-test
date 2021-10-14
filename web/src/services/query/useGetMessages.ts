import { useQuery, UseQueryOptions } from 'react-query';
import { client } from '../client';
import { MessageResponse } from '../response/Message';

const getMessagesFn = ({ conversationId }: { conversationId: string }) => {
  return client.get<{ conversationId: string }, MessageResponse[]>(
    `/messages/${conversationId}`
  );
};

export const useGetMessages = (id: string, args: UseQueryOptions) => {
  return useQuery(
    ['messages', { conversationId: id }],
    () => getMessagesFn({ conversationId: id }),
    args
  );
};
