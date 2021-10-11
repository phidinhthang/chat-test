import * as React from 'react';
import { useRemoveFriend } from '../services/mutations/useRemoveFriend';
import { useGetFriends } from '../services/query/useGetFriends';

export const FriendsList = () => {
  const { data, isError, isLoading, error } = useGetFriends();
  const { removeFriend } = useRemoveFriend();
  if (isLoading) {
    return <div>loading...</div>;
  }
  if (isError) {
    console.log(error);
    return <div>error</div>;
  }
  return (
    <div>
      {data?.friends.map((friend) => (
        <div
          key={friend.id}
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <li>{friend.username}</li>
          <button
            onClick={() => {
              removeFriend(friend.id);
            }}
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
};
