import { useQuery } from 'react-query';
import { client } from '../client';
import { User } from '../response/User';

const getFriendsFn = () =>
  client.get<undefined, { friends: User[] }>('/friends');

export const useGetFriends = () => useQuery('friends', getFriendsFn);
