import React from 'react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { userGetUsers } from '../services/query/useGetUsers';
import { useSendRequest } from '../services/mutations/useSendRequest';

const SECONDARY_AVATAR =
  'https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144';

export const UsersList = () => {
  const { data, isError, isLoading, error } = userGetUsers();
  const { sendRequest, isLoading: isSending } = useSendRequest();
  console.log('get users here', data);
  if (isLoading) {
    return <div>loading...</div>;
  }
  if (isError) {
    console.log(error);
    return <div>error</div>;
  }
  return (
    <div className='w-full'>
      <ul>
        {data?.users.map((friend) => (
          <li className='flex items-center justify-between' key={friend.id}>
            <div className='flex justify-start'>
              <Avatar size='medium' avatar={SECONDARY_AVATAR} />
              <div className='ml-2'>
                <p className='truncate w-36'>{friend.username}</p>
                <p>{friend.isOnline ? 'Is active' : 'not online'}</p>
              </div>
            </div>
            <div className='flex items-center'>
              <Button
                color='cancel'
                onClick={() => {
                  sendRequest(friend.id);
                }}
                loading={isSending}
              >
                Request
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
