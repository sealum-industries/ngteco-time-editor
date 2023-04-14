import type { SVGProps } from 'react';

export default function Check(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" {...props}>
      <path d="M448 130L431 147 177.5 399.2l-16.9 16.9-16.9-16.9L17 273.1 0 256.2l33.9-34 17 16.9L160.6 348.3 397.1 112.9l17-16.9L448 130z" />
    </svg>
  );
}
