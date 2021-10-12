import { useQueryClient } from 'react-query';
import { Conversation } from '../../services/response/Conversation';
import { User } from '../../services/response/User';

interface ConversationDisplayData {
  lastLoginAt: string;
  username: string;
  unreadCount: number;
  isOnline: boolean;
  latestMsg: string;
  id: string;
}

export const conversationLeftPaneDisplayData =
  (): ConversationDisplayData[] => {
    const queryClient = useQueryClient();
    const me = queryClient.getQueryData<User>('me')!;
    const conversations =
      queryClient.getQueryData<Conversation[]>('conversations')!;
    const displayData: ConversationDisplayData[] = conversations.map((c) => {
      const other = c.ownerOne.id !== me.id ? c.ownerOne : c.ownerTwo;
      return {
        id: c.id,
        isOnline: other.isOnline,
        lastLoginAt: other.lastLoginAt,
        latestMsg: c.messages[0].text,
        unreadCount: 0,
        username: other.username,
      };
    });

    return displayData;
  };
