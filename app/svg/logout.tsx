import type { SVGProps } from 'react';

export default function Logout(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
      <path d="M288 288l48 0 0 48 0 28.1L444.1 256 336 147.9l0 28.1 0 48-48 0-80 0 0 64 80 0zm190.1 1.9L352 416l-16 0-48 0 0-32 0-16 0-32-48 0-32 0-48 0 0-48 0-64 0-48 48 0 32 0 48 0 0-32 0-16 0-32 48 0 16 0L478.1 222.1 512 256l-33.9 33.9zM168 80L48 80l0 352 120 0 24 0 0 48-24 0L24 480 0 480l0-24L0 56 0 32l24 0 144 0 24 0 0 48-24 0z" />
    </svg>
  );
}
