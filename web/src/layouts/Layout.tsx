import React from 'react';
import { ConversationLeftPane } from '../ui/ConversationLeftPane';
import { Navbar } from './Navbar';
import { useWindowSize } from '../shared-hooks/useWindowSize';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { width, height } = useWindowSize();
  return (
    <>
      <div className='max-w-screen max-h-screen' style={{ width, height }}>
        <Navbar />
        <div className='flex'>
          <div className='w-72 lg:w-80 h-full'>
            <ConversationLeftPane />
          </div>
          <div className='flex-2 h-full w-full lg:w-8/12'>{children}</div>
          <div className='h-full w-0 lg:w-4/12'></div>
        </div>
      </div>
    </>
  );
};
