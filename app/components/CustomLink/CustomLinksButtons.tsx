import { Link } from '@remix-run/react';
import clsx from 'clsx';
import type { WithChildren } from '~/types/global';

type CustomLinkPropTypes = WithChildren<{
  to: string;
  classes?: string;
}>;

export const CustomLink = ({ to, classes, children }: CustomLinkPropTypes): JSX.Element => {
  return (
    <Link to={to} className={clsx('flex transition-colors duration-300 rounded px-4 py-2', classes)}>
      {children}
    </Link>
  );
};

type CustomButtonPropTypes = WithChildren<{
  onClick?: () => void;
  classes?: string;
  rest?: any[];
}> &
  Partial<JSX.IntrinsicElements['button']>;

export const CustomButton = ({ onClick, classes, children, ...rest }: CustomButtonPropTypes): JSX.Element => {
  return (
    <button
      onClick={onClick}
      className={clsx('flex transition-colors duration-300 px-4 py-2 rounded disabled:opacity-75', classes)}
      {...rest}
    >
      {children}
    </button>
  );
};
