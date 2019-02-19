import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { GlobeIcon, MicIcon, PlayOutlineIcon } from '../../ui/icons';
import Dots from './dots';

import './circle-stats.css';

const CircleStat = ({
  className,
  label,
  value,
  icon,
  ...props
}: { label: string; value: number; icon: React.ReactNode } & React.HTMLProps<
  HTMLDivElement
>) => (
  <div className={'circle-stat ' + (className || '')} {...props}>
    <Dots style={{ width: 70 }} />
    <div className="text">
      <Localized id={label}>
        <div className="label" />
      </Localized>
      <div className="value">{value}</div>
    </div>
    <div className="circle">{icon}</div>
  </div>
);

export default ({
  className,
  valid,
  total,
  languages,
  ...props
}: { valid: number; total: number; languages: number } & React.HTMLProps<
  HTMLDivElement
>) => (
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
