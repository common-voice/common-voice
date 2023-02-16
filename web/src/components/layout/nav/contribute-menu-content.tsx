import * as React from 'react';
import { Localized } from '@fluent/react';

import { LocaleLink } from '../../locale-helpers';
import { ListenIcon, MicIcon } from '../../ui/icons';
import URLS from '../../../urls';

type ContributeMenuContentProps = {
  className?: string;
};

export const ContributeMenuContent: React.FC<ContributeMenuContentProps> = ({
  className,
}) => {
  return (
    <div className={className}>
      <Localized id="contribute-nav-header-item-1">
        <p className="nav-header-item" />
      </Localized>
      <ul>
        <li>
          <LocaleLink to={URLS.SPEAK} className="contribute-link">
            <MicIcon />
            <Localized id="speak" />
          </LocaleLink>
        </li>
        <li>
          <LocaleLink to={URLS.LISTEN} className="contribute-link">
            <ListenIcon />
            <Localized id="listen" />
          </LocaleLink>
        </li>
      </ul>
    </div>
  );
};
