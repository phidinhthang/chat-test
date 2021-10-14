import { useInfiniteQuery, UseInfiniteQueryOptions } from 'react-query';
import { client } from '../client';
import { MessageResponse } from '../response/Message';

const getMessagesFn = ({
  conversationId,
  pageParam = undefined,
}: {
  conversationId: string;
  pageParam?: string;
}) => {
  return client.get<{ conversationId: string }, MessageResponse[]>(
    `/messages/${conversationId}`,
    {
      params: {
        cursor: pageParam,
      },
    }
  );
};

export const useGetMessages = (id: string, args: UseInfiniteQueryOptions) => {
  return useInfiniteQuery(
    ['messages', { conversationId: id }],
    ({ pageParam }) => getMessagesFn({ conversationId: id, pageParam }),
    {
      getNextPageParam: (lastPage) =>
        lastPage[lastPage.length - 1].createdAt ?? undefined,
    }
  );
};
