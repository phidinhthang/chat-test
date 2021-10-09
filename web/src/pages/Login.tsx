import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { client } from '../services/client';
import { setAccessToken } from '../lib/accessToken';
import { LoginInput } from '../types/input/LoginInput';
import { UserResponse } from '../types/response/User';

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const queryClient = useQueryClient();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { mutate, isError, error, isLoading } = useMutation(
    ({ username, password }: LoginInput) =>
      client.post<LoginInput, UserResponse>('/login', { username, password })
  );

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        console.log('form submitted');
        mutate(
          { username, password },
          {
            onSuccess: (data) => {
              queryClient.setQueryData('me', () => ({ user: data.user }));
              setAccessToken(data.token);
              history.push('/');
            },
          }
        );
      }}
    >
      <div>
        <input
          value={username}
          placeholder='username'
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
      </div>
      <div>
        <input
          type='password'
          value={password}
          placeholder='password'
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>
      <button type='submit' disabled={isLoading}>
        Submit
      </button>
      <pre>{isError ? JSON.stringify(error, null, 2) : null}</pre>
    </form>
  );
};
