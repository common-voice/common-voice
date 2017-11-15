import * as React from 'react';

export const DownloadIcon = () => (
  <FontIcon type="arrowDown" className="download-icon" />
);

const FONT_ICONS = {
  arrowDown: '',
  chrome: '',
  contact: '',
  discourse: '',
  facebook: '',
  firefox: '',
  github: '',
  hamburger: '',
  help: '',
  link: '',
  pause: '',
  play: '',
  redo: '',
  stop: '',
  twitter: '',
  undo: '',
  x: '',
};

interface FontIconProps {
  [key: string]: any;
  type: keyof typeof FONT_ICONS;
}

export const FontIcon = ({ type, ...props }: FontIconProps) => (
  <span aria-hidden="true" data-icon={FONT_ICONS[type]} {...props} />
);

export const RecordIcon = ({ size = 1, ...props }: any) => {
  const totalSize = size * 25;
  const halfSize = totalSize / 2;
  return (
    <svg width={totalSize} height={totalSize} {...props}>
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
