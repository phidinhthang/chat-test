import { useQuery } from 'react-query';
import { client } from '../client';
import { Conversation } from '../response/Conversation';

const getConversationFn = () =>
  client.get<undefined, Conversation>('/messages/conversations');

export const useGetConversations = () =>
  useQuery('conversations', getConversationFn);
