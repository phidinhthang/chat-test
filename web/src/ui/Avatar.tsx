import React, { ImgHTMLAttributes } from 'react';

const sizeClassnames = {
  small: 'w-6 h-6',
  big: 'w-10 sm:w-16 h-10 sm:h-16',
};

type AvatarProps = React.DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> & {
  avatar: string;
  size: keyof typeof sizeClassnames;
};

export const Avatar = ({ avatar, size, className, ...props }: AvatarProps) => {
  return (
    <img
      src={avatar}
      alt='My profile'
      className={`rounded-full ${sizeClassnames[size]} ${className}`}
      {...props}
    />
  );
};
