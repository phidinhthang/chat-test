import React from 'react';
import { Avatar } from '../ui/Avatar';
import { NavLink } from '../ui/NavLink';

export const Navbar = () => {
  return (
    <nav
      className='flex items-center bg-blue-900 p-3 py-2 flex-wrap'
      style={{ height: 68 }}
    >
      <NavLink href='/' className='p-2 mr-4 inline-flex items-center'>
        <span className='text-xl text-white font-bold uppercase tracking-wide'>
          <img src='/logo.png' className='w-9 h-9' />
        </span>
      </NavLink>
      <button
        className='text-white inline-flex p-3 hover:bg-gray-900 rounded lg:hidden ml-auto hover:text-white outline-none nav-toggler'
        data-target='#navigation'
      >
        <i className='material-icons'>menu</i>
      </button>
      <div
        className='hidden top-navbar w-full lg:inline-flex lg:flex-grow lg:w-auto'
        id='navigation'
      >
        <div
          className='lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start flex flex-col lg:h-auto
          '
        >
          <NavLink href='/friends'>Friend</NavLink>
          <div className='ml-5'>
            <Avatar avatar='/logo.png' size='medium' />
          </div>
        </div>
      </div>
    </nav>
  );
};
