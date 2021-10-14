import { useMutation, useQueryClient } from 'react-query';
import { requestWithoutToken } from '../client';
import { useHistory } from 'react-router';
import { setAccessToken } from '../../lib/accessToken';

interface LoginInput {
  username: string;
  password: string;
}

interface User {
  id: string;
  username: string;
  isOnline: boolean;
  lastLoginAt: string;
}

interface UserResponse {
  user: User;
  token: string;
}

const login = ({ username, password }: LoginInput) =>
  requestWithoutToken.post<LoginInput, UserResponse>('/login', {
    username,
    password,
  });

export const useLogin = () => {
  const history = useHistory();
  const queryClient = useQueryClient();
  return useMutation(login, {
    onSuccess: (data) => {
      queryClient.setQueryData('me', () => ({ user: data.user }));
      setAccessToken(data.token);
      history.push('/');
    },
  });
};
