import React from 'react';
import { useCurrentConversationContext } from '../contexts/currentConversation';
import { useRemoveFriend } from '../services/mutations/useRemoveFriend';
import { useHistory } from 'react-router-dom';
import { useGetFriends } from '../services/query/useGetFriends';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

const SECONDARY_AVATAR =
  'https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144';

export const FriendsList = () => {
  const history = useHistory();
  const { data, isError, isLoading, error } = useGetFriends();
  const { removeFriend, isLoading: isRemoving } = useRemoveFriend();
  const { setConversationId } = useCurrentConversationContext()!;

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
        {data?.friends.map((friend) => (
          <li className='flex items-center justify-between'>
            <div className='flex justify-start'>
              <Avatar size='medium' avatar={SECONDARY_AVATAR} />
              <div className='ml-2'>
                <p className='truncate w-36'>{friend.username}</p>
                <p>{friend.isOnline ? 'Is active' : 'not online'}</p>
              </div>
            </div>
            <div className='flex items-center'>
              <Button
                className='whitespace-nowrap mr-2'
                onClick={() => {
                  setConversationId('');
                  history.push('/');
                }}
              >
                Send message
              </Button>
              <Button
                color='cancel'
                onClick={() => {
                  removeFriend(friend.id);
                }}
                loading={isRemoving}
              >
                Cancel
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
