import { useQuery, UseQueryOptions } from 'react-query';
import { client } from '../client';
import { User } from '../response/User';

const getMeFn = () => client.get<undefined, { user: User }>('/me');

export const useGetMe = (args: UseQueryOptions) => {
  return useQuery('me', getMeFn, args);
};
