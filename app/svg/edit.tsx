import type { SVGProps } from 'react';

export default function Edit(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
      <path d="M184 0V24 64H328V24 0h48V24 64H480v80 48V464v48H432 80 32V464 192 144 64H136V24 0h48zM432 192H80V464H432V192zM224 424l-64 8 8-64 88.7-88.7 56 56L224 424zM335.3 312.7l-56-56L312 224l56 56-32.7 32.7z" />
    </svg>
  );
}
