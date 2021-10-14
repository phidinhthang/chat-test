import { useMutation, useQueryClient } from 'react-query';
import { useCurrentConversationContext } from '../../contexts/currentConversation';
import { client } from '../client';

const deleteMessageFn = (id: string) =>
  client.delete<{ messageId: string }, boolean>('/messages', {
    data: { messageId: id },
  });

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  const { conversationId } = useCurrentConversationContext()!;
  return useMutation(deleteMessageFn, {
    onSuccess: (data, id) => {
      queryClient.invalidateQueries(['messages', { conversationId }]);
    },
  });
};
