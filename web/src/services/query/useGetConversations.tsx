import { useQuery } from 'react-query';
import { client } from '../client';

export interface ConversationResponse {
  id: string;
  lastActivity: string;
  other: {
    id: string;
    username: string;
    isOnline: boolean;
    lastLoginAt: string;
  };
  latestMsg: {
    id: string;
    text: string;
    createdAt: string;
    isDeleted: string;
    status: string;
    owner: string;
  };
}

const getConversationFn = () =>
  client.get<undefined, ConversationResponse[]>('/messages/conversations');

export const useGetConversations = () =>
  useQuery('conversations', getConversationFn);
