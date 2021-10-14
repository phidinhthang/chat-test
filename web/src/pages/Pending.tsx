import React from 'react';
import { useAcceptFriendRequest } from '../services/mutations/useAcceptFriendRequest';
import { useCancelFriendRequest } from '../services/mutations/useCancelFriendRequest';
import { useGetPendingRequests } from '../services/query/useGetPendingRequests';
import { Button } from '../ui/Button';

export const Pending = () => {
  const { pendings, isLoading, isError, error } = useGetPendingRequests();
  const { isAccepting, accept } = useAcceptFriendRequest();
  const { cancel, isCancelling } = useCancelFriendRequest();

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
        {pendings
          ?.filter((i) => i.type)
          .map((pending) => (
            <li
              key={pending.id}
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <p>{pending.username}</p>
              <Button
                disabled={isAccepting}
                onClick={async () => {
                  accept(pending.id);
                }}
              >
                Accept
              </Button>
            </li>
          ))}
      </ul>
      <ul>
        <p>sent</p>
        {pendings
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
                  cancel(pending.id);
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
