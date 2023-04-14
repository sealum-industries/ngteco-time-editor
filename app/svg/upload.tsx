import type { SVGProps } from 'react';

export default function Upload(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
      <path d="M280 360v24H232V360 97.9l-95 95-17 17L86.1 176l17-17L239 23l17-17 17 17L409 159l17 17L392 209.9l-17-17-95-95V360zm32-8V304H464h48v48V464v48H464 48 0V464 352 304H48 200v48H48V464H464V352H312zm72 56a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z" />
    </svg>
  );
}
