import React from 'react';
import { AttachmentIcon } from '../icons/AttachmentIcon';
import { CameraIcon } from '../icons/CameraIcon';
import { HeartIcon } from '../icons/HeartIcon';
import { MicroIcon } from '../icons/MicroIcon';
import { RingIcon } from '../icons/RingIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { SendIcon } from '../icons/SendIcon';
import { SmileIcon } from '../icons/SmileIcon';
import { useWindowSize } from '../shared-hooks/useWindowSize';
import { messagesDisplayData } from '../utils/transformers/message';
import { AvatarHeader } from './AvatarHeader';
import { GroupMessage } from './GroupMessage';
import { MessageItem } from './MessageItem';
import { RoundedButton } from './RoundedButton';
import { useSendMessage } from '../services/mutations/useSendMessage';
import { useCurrentConversationContext } from '../contexts/currentConversation';
import { useQueryClient } from 'react-query';
import { useGetMessages } from '../services/query/useGetMessages';
import { ConversationResponse } from '../services/query/useGetConversations';
import useIntersectionObserver from '../shared-hooks/useIntersectionObserver';

const SECONDARY_AVATAR =
  'https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144';
const PRIMARY_AVATAR =
  'https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144';

export const Chat = () => {
  const { height } = useWindowSize();
  const { mutate } = useSendMessage();
  const [text, setText] = React.useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  const conversationContext = useCurrentConversationContext()!;
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = useGetMessages(
    conversationContext.conversationId as string,
    {
      enabled: typeof conversationContext.conversationId === 'string',
    }
  );
  if (!conversationContext?.conversationId) {
    return <p>choose one to chat with</p>;
  }
  const displayDatas = messagesDisplayData();
  const queryClient = useQueryClient();

  const loadMoreButtonRef = React.useRef<any>();

  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: fetchNextPage,
    enabled: true,
  });
  return (
    <div
      className={`flex-1 sm:px-4 justify-between flex flex-col overflow-y-auto w-full`}
      style={{ height: height - 68 }}
    >
      <button
        onClick={() => fetchNextPage()}
        ref={loadMoreButtonRef}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? 'loading more'
          : hasNextPage
          ? 'Load newer'
          : 'Nothing to load more'}
      </button>
      <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
        <AvatarHeader
          avatar={
            'https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144'
          }
          username='Anderson Vanhron'
        />
        <div className='flex items-center space-x-2'>
          <RoundedButton>
            <SearchIcon />
          </RoundedButton>
          <RoundedButton>
            <HeartIcon />
          </RoundedButton>
          <RoundedButton>
            <RingIcon />
          </RoundedButton>
        </div>
      </div>
      <div
        id='messages'
        className=' flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch
        '
      >
        {displayDatas.map((displayData) =>
          displayData.map((d, index) => (
            <GroupMessage
              variant={d.owner?.isOwner ? 'primary' : 'secondary'}
              avatar={d.owner?.isOwner ? PRIMARY_AVATAR : SECONDARY_AVATAR}
              key={index}
            >
              {({ variant }) => (
                <>
                  {d.messages.map((m) => (
                    <MessageItem
                      text={m.text}
                      key={m?.id ? m.id : Math.random()}
                      variant={variant}
                    />
                  ))}
                </>
              )}
            </GroupMessage>
          ))
        )}
      </div>
      <div className='border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0'>
        <div className='relative flex'>
          <span className='absolute inset-y-0 flex items-center'>
            <RoundedButton>
              <MicroIcon />
            </RoundedButton>
          </span>
          <input
            type='text'
            placeholder='Write Something'
            className='w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-full py-3'
            value={text}
            onChange={handleChange}
          />
          <div className='absolute right-0 items-center inset-y-0 hidden sm:flex'>
            <RoundedButton>
              <AttachmentIcon />
            </RoundedButton>
            <RoundedButton>
              <CameraIcon />
            </RoundedButton>
            <RoundedButton>
              <SmileIcon />
            </RoundedButton>
            <RoundedButton
              size='big'
              variant='primary'
              onClick={() => {
                console.log('click');
                const conversations =
                  queryClient.getQueryData<ConversationResponse[]>(
                    'conversations'
                  )!;
                const conversation = conversations.find(
                  (i) => i.id === conversationContext.conversationId
                );
                const otherId: string = conversation!.other.id;
                mutate({ otherId, text });
              }}
            >
              <SendIcon />
            </RoundedButton>
          </div>
        </div>
      </div>
    </div>
  );
};
