import * as React from 'react';
import { Localized } from '@fluent/react';
import classNames from 'classnames';

import { LocaleLink } from '../../locale-helpers';
import { ListenIcon, MicIcon } from '../../ui/icons';
import URLS from '../../../urls';

type ContributeMenuContentProps = {
  className?: string;
  pathname?: string;
};

export const ContributeMenuContent: React.FC<ContributeMenuContentProps> = ({
  className,
  pathname = '',
}) => {
  const speakActive = pathname.includes(URLS.SPEAK);
  const listenActive = pathname.includes(URLS.LISTEN);

  return (
    <div className={className}>
      <Localized id="contribute-voice-collection-nav-header">
        <p className="nav-header-item" />
      </Localized>
      <ul>
        <li
          className={classNames({
            'selected-option': speakActive,
          })}>
          <div className="list-items-wrapper">
            <div>
              <MicIcon />
              <LocaleLink to={URLS.SPEAK} className="contribute-link">
                <Localized id="speak" />
              </LocaleLink>
            </div>
            {speakActive && <span className="border" />}
          </div>
        </li>
        <li
          className={classNames({
            'selected-option': listenActive,
          })}>
          <div className="list-items-wrapper">
            <div>
              <ListenIcon />
              <LocaleLink to={URLS.LISTEN} className="contribute-link">
                <Localized id="listen" />
              </LocaleLink>
            </div>
            {listenActive && <span className="border" />}
          </div>
        </li>
      </ul>
    </div>
  );
};
