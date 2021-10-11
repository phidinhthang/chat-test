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
import { AvatarHeader } from './AvatarHeader';
import { GroupMessage } from './GroupMessage';
import { MessageItem } from './MessageItem';
import { RoundedButton } from './RoundedButton';

export const Chat = () => {
  const { height } = useWindowSize();
  return (
    <div
      className={`flex-1 sm:px-4 justify-between flex flex-col overflow-y-auto w-full`}
      style={{ height: height - 68 }}
    >
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
        <GroupMessage
          variant='secondary'
          avatar='https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144'
        >
          {({ variant }) => (
            <MessageItem
              text='Can be verified on any platform using docker'
              variant={variant}
            />
          )}
        </GroupMessage>
        <GroupMessage
          variant='primary'
          avatar='https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144'
        >
          {({ variant }) => (
            <MessageItem
              text='Your error message says permission denied, npm global installs
                  must be given root privileges.'
              variant={variant}
            />
          )}
        </GroupMessage>
        <GroupMessage
          variant='secondary'
          avatar='https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144'
        >
          {({ variant }) => (
            <>
              <MessageItem
                text="Command was run with root privileges. I'm sure about that."
                variant={variant}
              />
              <MessageItem
                text="I've update the description so it's more obviously now"
                variant={variant}
              />

              <MessageItem
                text='FYI https://askubuntu.com/a/700266/510172'
                variant={variant}
              />
            </>
          )}
        </GroupMessage>
        <GroupMessage
          variant='primary'
          avatar='https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144'
        >
          {({ variant }) => (
            <>
              <MessageItem
                variant={variant}
                text="Any updates on this issue? I'm getting the same error when trying to install devtools. Thanks"
              />
            </>
          )}
        </GroupMessage>
        <GroupMessage
          variant='secondary'
          avatar='https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144'
        >
          {({ variant }) => (
            <>
              <MessageItem
                variant={variant}
                text="Thanks for your message David. I thought I'm alone with this
                  issue. Please, 👍 the issue to support it :)"
              />
            </>
          )}
        </GroupMessage>
        <GroupMessage
          variant='primary'
          avatar='https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144'
        >
          {({ variant }) => (
            <>
              <MessageItem variant={variant} text='Are you using sudo?' />
              <MessageItem
                variant={variant}
                text='Run this command sudo chown -R `whoami` /Users/ /.npm-global/
                  then install the package globally without using sudo'
              />
            </>
          )}
        </GroupMessage>
        <GroupMessage
          variant='secondary'
          avatar='https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144'
        >
          {({ variant }) => (
            <>
              <MessageItem
                text='It seems like you are from Mac OS world. There is no /Users/
                  folder on linux 😄'
                variant={variant}
              />
              <MessageItem
                text=' I have no issue with any other packages installed with root
                  permission globally.'
                variant={variant}
              />
            </>
          )}
        </GroupMessage>
        <GroupMessage
          variant='primary'
          avatar='https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144'
        >
          {({ variant }) => (
            <>
              <MessageItem
                variant={variant}
                text='yes, I have a mac. I never had issues with root permission as
                  well, but this helped me to solve the problem'
              />
            </>
          )}
        </GroupMessage>
        <GroupMessage
          variant='secondary'
          avatar='https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144'
        >
          {({ variant }) => (
            <>
              <MessageItem
                text='I get the same error on Arch Linux (also with sudo)'
                variant={variant}
              />
              <MessageItem
                variant={variant}
                text='I also have this issue, Here is what I was doing until now:
                  #1076'
              />
              <MessageItem variant={variant} text=' even i am facing' />
            </>
          )}
        </GroupMessage>
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
            className='w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-full py-3
            '
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
            <RoundedButton size='big' variant='primary'>
              <SendIcon />
            </RoundedButton>
          </div>
        </div>
      </div>
    </div>
  );
};
