import React from 'react';
import { Avatar } from './Avatar';
const statusClassnames = {
  online: 'text-green-500',
  offline: 'text-red-600',
};

export const AvatarHeader = ({
  avatar,
  username,
  status = 'online',
}: {
  avatar: string;
  username: string;
  status?: keyof typeof statusClassnames;
}) => {
  return (
    <div className='flex items-center space-x-4'>
      <Avatar avatar={avatar} size='big' />
      <div className='flex flex-col leading-tight'>
        <div className='text-2xl mt-1 flex items-center'>
          <span className='text-gray-700 mr-3'>{username}</span>
          <span className={statusClassnames[status]}>
            <svg width='10' height='10'>
              <circle cx='5' cy='5' r='5' fill='currentColor'></circle>
            </svg>
          </span>
        </div>
        <span className='text-lg text-gray-600'>Junior Developer</span>
      </div>
    </div>
  );
};
