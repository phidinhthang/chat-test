import React from 'react';
import { useGetConversations } from '../services/query/useGetConversations';
import { ConversationItem } from './ConversationItem';

export const ConversationLeftPane = () => {
  const { isLoading, data, isError, error } = useGetConversations();
  if (isLoading) {
    return <p>loading...</p>;
  }
  if (isError) {
    console.log(error);
    return <p>error</p>;
  }

  return (
    <div className='w-72 lg:w-80'>
      <div className='flex flex-col -mx-4'>
        {data!.map((d) => (
          <ConversationItem
            id={d.id}
            unreadCount={0}
            username={d.other.username}
            key={d.id}
            isOnline={d.other.isOnline}
            lastLoginAt={d.other.lastLoginAt}
            latestMsg={d.latestMsg.text}
          />
        ))}
      </div>
    </div>
  );
};
