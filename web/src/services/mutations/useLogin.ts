import { useMutation, useQueryClient } from 'react-query';
import { LoginInput } from '../input/LoginInput';
import { requestWithoutToken } from '../client';
import { useHistory } from 'react-router';
import { UserResponse } from '../response/User';
import { setAccessToken } from '../../lib/accessToken';

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
