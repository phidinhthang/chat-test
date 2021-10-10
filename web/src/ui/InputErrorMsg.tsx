import React from 'react';

interface InputErrorMsgProps {}

export const InputErrorMsg: React.FC<InputErrorMsgProps> = ({ children }) => {
  return <div className={`flex text-red-500`}>{children}</div>;
};
