import type { SVGProps } from 'react';

export default function Print(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
      <path d="M112 160V48H364.1L400 83.9V160h48V64L384 0H112 64V48 160h48zM384 368v96H128V368H384zM128 320H80v32H48V240H464V352H432V320H384 128zm304 80h32 48V352 240 192H464 48 0v48V352v48H48 80v64 48h48H384h48V464 400z" />
    </svg>
  );
}
