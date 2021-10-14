import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export const Link = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) => {
  return <RouterLink to={href}>{children}</RouterLink>;
};
