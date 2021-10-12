import React from 'react';
import { useGetConversations } from '../services/query/useGetConversations';
import { conversationLeftPaneDisplayData } from '../utils/transformers/conversation';
import { ConversationItem } from './ConversationItem';

export const ConversationLeftPane = () => {
  useGetConversations();
  const displayData = conversationLeftPaneDisplayData();
  return (
    <div className='w-72 lg:w-80'>
      <div className='flex flex-col -mx-4'>
        {displayData.map((data) => (
          <ConversationItem
            id={data.id}
            unreadCount={data.unreadCount}
            username={data.username}
            key={data.id}
            isOnline={data.isOnline}
            lastLoginAt={data.lastLoginAt}
            latestMsg={data.latestMsg}
          />
        ))}
      </div>
    </div>
  );
};
