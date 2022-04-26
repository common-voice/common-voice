import { Localized } from '@fluent/react';
import * as React from 'react';
import { GlobeIcon, MicIcon, PlayOutlineIcon } from '../../ui/icons';
import Dots from './dots';

import './circle-stats.css';

interface CircleStatProps {
  className?: string;
  label: string;
  value: string | number;
  dotBackground?: string;
  dotColor?: string;
  dotSpace?: number;
  dotWidth?: number;
  icon: React.ReactNode;
}

export const CircleStat = ({
  className,
  label,
  value,
  icon,
  dotBackground,
  dotColor,
  dotSpace,
  dotWidth,
  ...props
}: CircleStatProps & React.HTMLProps<HTMLDivElement>) => (
  <div className={'circle-stat ' + (className || '')} {...props}>
    <Dots
      {...{ backgroundColor: dotBackground, color: dotColor, space: dotSpace }}
      style={{ width: dotWidth ? dotWidth : 70 }}
    />
    <div className="text">
      <Localized id={label}>
        <div className="label" />
      </Localized>
      <div className="value">{value}</div>
    </div>
    <div className="circle">{icon}</div>
  </div>
);

interface CircleStatsProps {
  className?: string;
  valid: string | number;
  total: string | number;
  languages: number;
}

const CircleStats = ({
  className,
  valid,
  total,
  languages,
  ...props
}: CircleStatsProps & React.HTMLProps<HTMLDivElement>) => (
  <div className={'circle-stats ' + className} {...props}>
    <CircleStat
      className="valid-hours"
      label="validated-hours"
      value={valid}
      icon={<PlayOutlineIcon />}
    />
    <CircleStat
      className="total-hours"
      label="recorded-hours"
      value={total}
      icon={<MicIcon />}
    />
    <CircleStat
      className="languages"
      label="languages"
      value={languages}
      icon={<GlobeIcon />}
    />
  </div>
);

export default CircleStats;
