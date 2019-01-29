import * as React from 'react';

const color = '#cbcbcb';
const size = 1.5;
const space = 10;

export default ({ style, ...props }: React.HTMLProps<HTMLDivElement>) => (
  <div
    className="dots"
    style={{
      ...style,
      background: [
        `linear-gradient(90deg, white ${space -
          size}px, transparent 1%) center`,
        `linear-gradient(white ${space - size}px, transparent 1%) center`,
        color,
      ].join(', '),
      backgroundSize: `${space}px ${space}px`,
    }}
    {...props}
  />
);
