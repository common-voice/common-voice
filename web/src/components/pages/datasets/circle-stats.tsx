import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { GlobeIcon, MicIcon, PlayOutlineIcon } from '../../ui/icons';
import Dots from './dots';

import './circle-stats.css';

const CircleStat = ({
  className,
  label,
  icon,
  ...props
}: { icon: React.ReactNode; label: string } & React.HTMLProps<
  HTMLDivElement
>) => (
  <div className={'circle-stat ' + (className || '')} {...props}>
    <Dots style={{ width: 70 }} />
    <div className="text">
      <Localized id={label}>
        <div className="label" />
      </Localized>
      <div className="value">1234</div>
    </div>
    <div className="circle">{icon}</div>
  </div>
);

export default ({ className, ...props }: React.HTMLProps<HTMLDivElement>) => (
  <div className={'circle-stats ' + className} {...props}>
    <CircleStat
      className="valid-hours"
      label="validated-hours"
      icon={<PlayOutlineIcon />}
    />
    <CircleStat
      className="total-hours"
      label="recorded-hours"
      icon={<MicIcon />}
    />
    <CircleStat className="languages" label="languages" icon={<GlobeIcon />} />
  </div>
);
