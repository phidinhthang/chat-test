import React, { ImgHTMLAttributes } from 'react';
import { AvatarIcon } from '../icons/AvatarIcon';
import { useImageOnLoad } from '../shared-hooks/useImageOnLoad';

const sizeClassnames = {
  small: 'w-6 h-6',
  medium: 'w-10 h-10 sm:w-12 sm:h-12',
  big: 'w-10 sm:w-16 h-10 sm:h-16',
};

type AvatarProps = React.DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> & {
  avatar: string;
  size?: keyof typeof sizeClassnames;
};

export const Avatar = ({
  avatar,
  size = 'small',
  className,
  ...props
}: AvatarProps) => {
  const { css, handleImageOnLoad, isLoaded } = useImageOnLoad();
  return (
    <>
      {!isLoaded && (
        <span
          style={{ ...css.thumbnail }}
          className={`rounded-full ${sizeClassnames[size]} ${className}`}
        >
          <AvatarIcon
            className={`rounded-full ${sizeClassnames[size]} ${className}`}
          />
        </span>
      )}
      <img
        src={avatar}
        onLoad={handleImageOnLoad}
        alt='My profile'
        className={`rounded-full ${sizeClassnames[size]} ${className}`}
        style={{ ...css.fullSize }}
        {...props}
      />
    </>
  );
};
