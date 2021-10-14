import { useQuery } from 'react-query';
import { requestWithoutToken } from '../client';
import { User } from '../response/User';

const getUsersFn = () =>
  requestWithoutToken.get<undefined, { users: User[] }>('/users');

export const userGetUsers = () => {
  return useQuery('users', getUsersFn);
};
