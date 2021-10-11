import React from 'react';

interface ConversationItemProps {
  lastLoginAt?: string;
  username: string;
  unreadCount?: number;
  isOnline?: boolean;
  latestMsg?: string;
}

export const ConversationItem = ({
  lastLoginAt,
  username,
  unreadCount,
  isOnline = false,
  latestMsg = '',
}: ConversationItemProps) => {
  if (isOnline) lastLoginAt = '';
  return (
    <div className='relative flex flex-row items-center p-4 hover:bg-gray-100 w-full'>
      <div className='absolute text-xs text-gray-500 right-0 top-0 mr-4 mt-3'>
        {lastLoginAt}
      </div>
      <div
        className=' flex items-center justify-center h-10 w-10 rounded-full bg-pink-500 text-pink-300 font-bold flex-shrink-0
            '
      >
        T
      </div>
      <div className='flex flex-col flex-grow ml-3'>
        <div className='flex items-center'>
          <div className='text-sm font-medium'>{username}</div>
          <div
            className={`h-2 w-2 rounded-full ml-2 ${
              isOnline ? 'bg-green-500' : 'bg-red-600'
            }`}
          ></div>
        </div>
        <div className='text-xs truncate w-52 lg:w-60'>{latestMsg}</div>
      </div>
      {unreadCount && (
        <div className='flex-shrink-0 self-end mb-1'>
          <span
            className=' flex items-center justify-center h-5 w-5 bg-red-500 text-white text-xs rounded-full
              '
          >
            {unreadCount}
          </span>
        </div>
      )}
    </div>
  );
};
