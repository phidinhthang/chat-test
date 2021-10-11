import React from 'react';
import { Link } from 'react-router-dom';

type NavLinkProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: (a: any) => any;
  href?: string;
};

export const NavLink = ({
  children,
  className = '',
  onClick,
  href = '',
  ...props
}: NavLinkProps) => {
  if (onClick) href = '#';
  return (
    <>
      <Link
        {...props}
        to={href}
        className={`lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-gray-400 items-center justify-center hover:bg-gray-900 hover:text-white ${className}`}
        onClick={onClick}
      >
        <span>{children}</span>
      </Link>
    </>
  );
};
