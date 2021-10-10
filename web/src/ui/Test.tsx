import React from 'react';
import { SearchIcon } from '../icons/SearchIcon';
import { AvatarHeader } from './AvatarHeader';

export const Test = () => {
  return (
    <>
      <AvatarHeader
        avatar={
          'https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144'
        }
        username='Anderson Vanhron'
      />
      <SearchIcon />
    </>
  );
};
