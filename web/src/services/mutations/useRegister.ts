import { useMutation, useQueryClient } from 'react-query';
import { useHistory } from 'react-router';
import { setAccessToken } from '../../lib/accessToken';
import { requestWithoutToken } from '../client';
import { RegisterInput } from '../input/RegisterInput';
import { UserResponse } from '../response/User';

const registerFn = ({ username, password }: RegisterInput) =>
  requestWithoutToken.post<RegisterInput, UserResponse>('/register', {
    username,
    password,
  });

export const useRegister = () => {
  const history = useHistory();
  const queryClient = useQueryClient();
  const { mutate: register, ...rest } = useMutation(registerFn, {
    onSuccess: (data) => {
      queryClient.setQueryData('me', () => ({ user: data.user }));
      setAccessToken(data.token);
      history.push('/');
    },
  });

  return { register, ...rest };
};
