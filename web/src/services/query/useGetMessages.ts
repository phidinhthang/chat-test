import { useQuery } from 'react-query';
import { client } from '../client';
import { MessageResponse } from '../response/Message';

const getMessagesFn = ({ conversationId }: { conversationId: string }) =>
  client.get<{ conversationId: string }, MessageResponse[]>('/messages', {
    data: { conversationId },
  });

export const useGetMessages = (id: string) => {
  return useQuery(['messages', { conversationId: id }], (id: any) =>
    getMessagesFn({ conversationId: id })
  );
};
