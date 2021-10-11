import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { setAccessToken } from '../lib/accessToken';
import { User } from '../services/response/User';
import { client } from '../services/client';

export const Header = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery('me', () =>
    client.get<undefined, { user: User }>('/me')
  );
  const { mutate } = useMutation(() =>
    client.post<undefined, boolean>('/logout')
  );
  let body: any = null;
  if (isLoading) {
    body = null;
  } else if (data) {
    console.log('data ', data?.user?.username);
    body = <div>you are logged in as: {data.user.username}</div>;
  } else {
    body = <div>not logged in</div>;
  }

  return (
    <header>
      <div>
        <Link to='/'>home</Link>
      </div>
      <div>
        <Link to='/register'>register</Link>
      </div>
      <div>
        <Link to='/login'>login</Link>
      </div>
      <div>
        <Link to='/pending'>Pending</Link>
      </div>
      <div>
        <Link to='/friends'>Friends</Link>
      </div>
      <div>
        <Link to='/chat'>chat</Link>
      </div>
      <div>
        <Link to='/test'>test</Link>
      </div>
      <div>
        {!isLoading && data ? (
          <button
            onClick={async () => {
              mutate(undefined, {
                onSuccess: () => {
                  setAccessToken('');
                  queryClient.clear();
                },
              });
            }}
          >
            logout
          </button>
        ) : null}
        {body}
      </div>
    </header>
  );
};
