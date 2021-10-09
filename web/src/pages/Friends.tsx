import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { client } from '../services/client';
import { User } from '../types/response/User';

export const FriendsList = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery('friends', () =>
    client.get<undefined, { friends: User[] }>('/friends')
  );
  const { mutate } = useMutation((id: string) =>
    client.post<{ otherId: string }, boolean>('/removeFriend', { otherId: id })
  );
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
              mutate(friend.id, {
                onSuccess: (data, id) => {
                  if (data) {
                    queryClient.setQueryData('friends', (friends) => {
                      if (friends && Array.isArray(friends)) {
                        return [...(friends as User[])].filter(
                          (friend) => friend.id !== id
                        );
                      }
                      return friends;
                    });
                  }
                },
              });
            }}
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
};
