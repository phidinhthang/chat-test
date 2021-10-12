import { useMutation, useQueryClient } from 'react-query';
import { client } from '../client';
import { Message, MessageResponse } from '../response/Message';

/** api should return conversation id for query client cache */
const sendMessageFn = ({ otherId, text }: MessageInput) =>
  client.post<MessageInput, Message>('/messages', { otherId, text });

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation(sendMessageFn, {
    onSuccess: (
      { text, isDeleted, createdAt, id, status, conversation },
      { otherId }
    ) => {
      queryClient.setQueryData<MessageResponse[] | undefined>(
        ['messages', { conversationId: conversation.id }],
        (messages) => {
          if (messages && Array.isArray(messages)) {
            const ownerId =
              conversation.ownerOne.id !== otherId
                ? conversation.ownerOne.id
                : conversation.ownerTwo.id;
            return [
              {
                text,
                isDeleted,
                createdAt,
                id,
                status,
                ownerId,
                conversationId: conversation.id,
              },
              ...messages,
            ];
          }
          return messages;
        }
      );
    },
  });
};
