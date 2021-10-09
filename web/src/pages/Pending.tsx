import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { client } from '../services/client';
import { User } from '../types/response/User';

export const Pending = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, isError } = useQuery('pendings', () =>
    client.get<undefined, (User & { type: 0 | 1 })[]>('/pending')
  );
  const { mutate: accept, isLoading: isAccepting } = useMutation((id: string) =>
    client.post<{ otherId: string }, boolean>('/acceptRequest', { otherId: id })
  );
  const { mutate: cancel, isLoading: isCancelling } = useMutation(
    (id: string) =>
      client.post<{ otherId: string }, boolean>('/cancelRequest', {
        otherId: id,
      })
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
      <ul>
        <p>received</p>
        {data
          ?.filter((i) => i.type)
          .map((pending) => (
            <li
              key={pending.id}
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <p>{pending.username}</p>
              <button
                disabled={isAccepting}
                onClick={async () => {
                  accept(pending.id, {
                    onSuccess: (data, id) => {
                      if (data) {
                        queryClient.setQueryData<User[] | undefined>(
                          'friends',
                          (friends) => {
                            if (friends && Array.isArray(friends)) {
                              return [
                                ...friends,
                                { id: pending.id, username: pending.username },
                              ];
                            }
                            return friends;
                          }
                        );
                        queryClient.setQueryData<User[] | undefined>(
                          'pendings',
                          (pendings) => {
                            if (pendings && Array.isArray(pendings)) {
                              return pendings.filter(
                                (p) => p.id !== pending.id || pending.type === 0
                              );
                            }
                            return pendings;
                          }
                        );
                      }
                    },
                  });
                }}
              >
                Accept
              </button>
            </li>
          ))}
      </ul>
      <ul>
        <p>sent</p>
        {data
          ?.filter((i) => !i.type)
          .map((pending) => (
            <li
              key={pending.id}
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <p>{pending.username}</p>
              <button
                disabled={isCancelling}
                onClick={async () => {
                  cancel(pending.id, {
                    onSuccess: (data, id) => {
                      if (data) {
                        queryClient.setQueryData<User[] | undefined>(
                          'pendings',
                          (pendings) => {
                            if (pendings && Array.isArray(pendings)) {
                              return pendings.filter(
                                (p) => p.id !== pending.id || pending.type === 1
                              );
                            }
                            return pendings;
                          }
                        );
                      }
                    },
                  });
                }}
              >
                Cancel
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};
