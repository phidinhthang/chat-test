import React from 'react';

const sizeClassnames = {
  medium: 'h-10 w-10',
  big: 'h-12 w-12',
};

const variantClassnames = {
  primary: 'text-white bg-blue-500 hover:bg-blue-400',
  secondary: 'text-gray-500 hover:bg-gray-300',
};

type RoundedButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  children: React.ReactNode;
  size?: keyof typeof sizeClassnames;
  variant?: keyof typeof variantClassnames;
};

export const RoundedButton = ({
  children,
  size = 'medium',
  variant = 'secondary',
  ...props
}: RoundedButtonProps) => {
  return (
    <button
      type='button'
      className={`inline-flex items-center justify-center rounded-full transition duration-500 ease-in-out focus:outline-none 
				${variantClassnames[variant]}
				${sizeClassnames[size]}
			`}
      {...props}
    >
      {children}
    </button>
  );
};
