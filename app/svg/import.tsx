import type { SVGProps } from 'react';

export default function Import(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
      <path d="M464 464H176V368H128v96 48h48H464h48V464 128L384 0H176 128V48 256h48V48H352V160H464V464zM297 215l-17-17L246.1 232l17 17 39 39H24 0v48H24 302.1l-39 39-17 17L280 425.9l17-17 80-80 17-17-17-17-80-80z" />
    </svg>
  );
}
