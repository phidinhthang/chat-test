import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { client } from '../services/client';
import { User } from '../types/response/User';

export const Home = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery('users', () =>
    client.get<undefined, { users: User[] }>('/users')
  );
  const { data: friends } = useQuery('friends', () =>
    client.get<undefined, { friends: User[] }>('/friends')
  );
  const { mutate } = useMutation((id: string) =>
    client.post<{ otherId: string }, boolean>('/sendRequest', { otherId: id })
  );

  if (isLoading && !friends?.friends) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <div>users:</div>
      <ul>
        {data?.users?.map((user) => {
          let isFriend = !!friends?.friends?.find((f) => f.id === user.id);
          return (
            <li key={user.id}>
              <p>{user.username}</p>
              {!isFriend && (
                <button
                  onClick={() => {
                    mutate(user.id, {
                      onSuccess: () => {
                        queryClient.setQueryData('pendings', (friends) => {
                          if (friends && Array.isArray(friends)) {
                            return [
                              ...friends,
                              { id: user.id, username: user.username, type: 0 },
                            ];
                          }
                          return friends;
                        });
                      },
                    });
                  }}
                >
                  request
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
