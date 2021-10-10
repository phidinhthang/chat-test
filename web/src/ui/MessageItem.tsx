import React from 'react';

const variantClassnames = {
  secondary: 'bg-gray-300 text-gray-600',
  primary: 'rounded-br-none bg-blue-600 text-white',
};

export const MessageItem = ({
  text,
  variant,
}: {
  text: string;
  variant: keyof typeof variantClassnames;
}) => {
  return (
    <>
      <div>
        <span
          className={` px-4 py-2 rounded-lg inline-block ${variantClassnames[variant]}`}
        >
          {text}
        </span>
      </div>
    </>
  );
};
