import * as React from 'react';

export const RecordIcon = ({ size = 1 }) => {
  const totalSize = size * 25;
  const halfSize = totalSize / 2;
  return (
    <svg width={totalSize} height={totalSize}>
      <circle
        cx={halfSize}
        cy={halfSize}
        r={totalSize * 0.4}
        stroke="#FF4E5E"
        strokeWidth={totalSize / 15}
        fill="transparent"
      />
      <circle cx={halfSize} cy={halfSize} r={totalSize * 0.28} fill="#FF4E5E" />
    </svg>
  );
};
