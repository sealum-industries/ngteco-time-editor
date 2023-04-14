import type { SVGProps } from 'react';

export default function Home(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" {...props}>
      <path d="M303.5 13.7L288 .5 272.5 13.7l-264 224 31.1 36.6L64 253.5V488v24H88 488h24V488 253.5l24.5 20.8 31.1-36.6-264-224zM112 464V212.8L288 63.5 464 212.8V464H384V296 272H360 216 192v24V464H112zm128 0V320h96V464H240z" />
    </svg>
  );
}
