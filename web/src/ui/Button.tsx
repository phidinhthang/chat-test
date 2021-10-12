import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
} from 'react';
import { Spinner } from './Spinner';

const sizeClassnames = {
  big: 'py-2 px-6 text-sm rounded-lg',
};

const colorClassnames = {
  primary:
    'bg-blue-600 hover:bg-blue-700 text-white transition duration-100 ease-in-out focus:ring-2 focus:ring-blue-500',
  cancel:
    'bg-red-500 hover:bg-red-600 text-white transition duration-100 ease-in-out focus:ring-2 focus:ring-red-600',
};

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  size?: keyof typeof sizeClassnames;
  color?: keyof typeof colorClassnames;
  loading?: boolean;
  icon?: ReactNode;
  transition?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  size = 'big',
  color = 'primary',
  disabled,
  loading,
  icon,
  className = '',
  transition,
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`flex outline-none ${sizeClassnames[size]}
				${transition ? `transition duration-100 ease-in-out` : ``} ${
        colorClassnames[color]
      }
				font-bold flex items-center justify-center ${className}
			`}
      {...props}
    >
      <span className={loading ? 'opacity-0' : 'flex items-center'}>
        {icon ? <span className={`mr-2 items-center`}>{icon}</span> : null}
        {children}
      </span>
      {loading ? (
        <span className='absolute'>
          <Spinner size={size === 'big' ? '5' : '4'} />
        </span>
      ) : null}
    </button>
  );
};
