import type { SVGProps } from 'react';

export default function Save(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" {...props}>
      <path d="M48 480H0V432 80 32H48 336L448 144V432v48H400 48zm352-48V163.9l-80-80V184v24H296 104 80V184 80H48V432H400zM128 80v80H272V80H128zm32 240a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z" />
    </svg>
  );
}
