import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { client } from '../client';
import { Message } from '../response/Message';

/** api should return conversation id for query client cache */
const sendMessageFn = ({ otherId, text }: MessageInput) =>
  client.post<MessageInput, Message>('/messages', { otherId, text });

export const useSendMessage = () => {
  const [, rerender] = React.useState();
  const queryClient = useQueryClient();
  return useMutation(sendMessageFn, {
    onSuccess: async (a, { otherId }) => {
      console.log(a);
      queryClient.invalidateQueries([
        'messages',
        { conversationId: a.conversation },
      ]);
      rerender(undefined);
    },
  });
};
