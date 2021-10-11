import React from 'react';
import { Avatar } from './Avatar';

interface GroupMessageProps {
  avatar: string;
  variant: 'primary' | 'secondary';
  children: ({ variant }: { variant: 'primary' | 'secondary' }) => JSX.Element;
}

export const GroupMessage: React.FC<GroupMessageProps> = ({
  avatar,
  variant,
  children,
}) => {
  const cn = variant == 'primary' ? 'order-1 items-end' : 'order-2 items-start';
  return (
    <div className='chat-message'>
      <div
        className={`flex items-end ${
          variant === 'primary' ? 'justify-end' : ''
        }`}
      >
        <div
          className={`flex flex-col space-y-2 text-xs max-w-xs mx-2 ${cn}
	`}
        >
          {children({ variant })}
        </div>
        <Avatar avatar={avatar} className='order-1' />
      </div>
    </div>
  );
};
