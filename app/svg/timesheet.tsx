import type { SVGProps } from 'react';

export default function TimeSheet(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" {...props}>
      <path d="M48 80V432H528V80H48zM0 32H48 528h48V80 432v48H528 48 0V432 80 32zM96 160a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm104-24h24H448h24v48H448 224 200V136zm0 96h24H448h24v48H448 224 200V232zm0 96h24H448h24v48H448 224 200V328zm-72-40a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM96 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
    </svg>
  );
}
