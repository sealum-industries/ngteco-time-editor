import type { SVGProps } from 'react';

export default function Download(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
      <path d="M280 24V0H232V24 294.1l-95-95-17-17L86.1 216l17 17L239 369l17 17 17-17L409 233l17-17L392 182.1l-17 17-95 95V24zM128.8 304H48 0v48V464v48H48 464h48V464 352 304H464 383.2l-48 48H464V464H48V352H176.8l-48-48zM432 408a24 24 0 1 0 -48 0 24 24 0 1 0 48 0z" />
    </svg>
  );
}
