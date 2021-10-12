import { useMutation, useQueryClient } from 'react-query';
import { useCurrentConversationContext } from '../../contexts/currentConversation';
import { client } from '../client';
import { MessageResponse } from '../response/Message';

const deleteMessageFn = (id: string) =>
  client.delete<{ messageId: string }, boolean>('/messages', {
    data: { messageId: id },
  });

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  const { conversationId } = useCurrentConversationContext()!;
  return useMutation(deleteMessageFn, {
    onSuccess: (data, id) => {
      queryClient.setQueryData<MessageResponse[] | undefined>(
        ['messages', { conversationId }],
        (messages) => {
          if (data) {
            return messages?.filter((m) => m.id !== id);
          }
          return messages;
        }
      );
    },
  });
};
