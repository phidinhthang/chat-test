import React from 'react';
import { ConversationItem } from './ConversationItem';

export const ConversationLeftPane = () => {
  return (
    <div className='w-72 lg:w-80'>
      <div className='flex flex-col -mx-4'>
        <ConversationItem
          unreadCount={5}
          username='Cuberto'
          latestMsg='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis,
              doloribus?'
          lastLoginAt='5 min'
        />
        <ConversationItem
          // unreadCount={5}
          username='Cuberto'
          latestMsg='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis,
              doloribus?'
          lastLoginAt='5 min'
          isOnline={true}
        />
      </div>
    </div>
  );
};
