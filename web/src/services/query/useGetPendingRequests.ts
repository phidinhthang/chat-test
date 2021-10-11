import { useQuery } from 'react-query';
import { client } from '../client';
import { User } from '../response/User';

const getPendingFn = () =>
  client.get<undefined, (User & { type: 0 | 1 })[]>('/pending');

export const useGetPendingRequests = () => {
  const { data: pendings, ...rest } = useQuery('pendings', getPendingFn);

  return { pendings, ...rest };
};
