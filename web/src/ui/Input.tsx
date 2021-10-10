import React, { forwardRef } from 'react';

export interface InputProps extends React.ComponentPropsWithRef<'input'> {
  textarea?: boolean;
  rows?: number;
  error?: string;
  transparent?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, textarea, error, transparent, ...props }, ref) => {
    const bg = transparent ? `bg-transparent` : `bg-white`;
    const ring = error ? `ring-2 bg-red-500` : '';
    const cn = `w-full py-2 px-4 rounded-md border border-black text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-none focus:ring-blue-600 ${bg} ${ring} ${className}`;
    return textarea ? (
      <textarea ref={ref as any} className={cn} {...(props as any)} />
    ) : (
      <input ref={ref as any} className={cn} {...props} />
    );
  }
);
