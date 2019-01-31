import * as React from 'react';

export default ({
  backgroundColor,
  color,
  size,
  space,
  style,
  ...props
}: {
  backgroundColor?: string;
  color?: string;
  size?: number;
  space?: number;
} & React.HTMLProps<HTMLDivElement>) => {
  backgroundColor = backgroundColor || 'white';
  color = color || '#cbcbcb';
  size = size || 1.5;
  space = space || 10;
  return (
    <div
      className="dots"
      style={{
        ...style,
        background: [
          `linear-gradient(90deg, ${backgroundColor} ${space -
            size}px, transparent 1%) center`,
          `linear-gradient(${backgroundColor} ${space -
            size}px, transparent 1%) center`,
          color,
        ].join(', '),
        backgroundSize: `${space}px ${space}px`,
      }}
      {...props}
    />
  );
};
