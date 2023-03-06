import * as React from 'react';
import { Localized } from '@fluent/react';
import classNames from 'classnames';

import { LocaleLink } from '../../locale-helpers';
import { EditIcon, ListenIcon, MicIcon } from '../../ui/icons';
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
      <div>
        <Localized id="contribute-voice-collection-nav-header">
          <p className="nav-header-item" />
        </Localized>
        <ul>
          <li
            className={classNames({
              'selected-option': speakActive,
            })}>
            <MicIcon />
            <LocaleLink to={URLS.SPEAK} className="contribute-link">
              <Localized id="speak" />
            </LocaleLink>
            {speakActive && <span className="border" />}
          </li>
          <li
            className={classNames({
              'selected-option': listenActive,
            })}>
            <ListenIcon />
            <LocaleLink to={URLS.LISTEN} className="contribute-link">
              <Localized id="listen" />
            </LocaleLink>
            {listenActive && <span className="border" />}
          </li>
        </ul>
      </div>
      <div className="vertical-line" />
      <div>
        <Localized id="contribute-sentence-collection-nav-header">
          <p className="nav-header-item" />
        </Localized>
        <ul>
          <li className="write">
            <EditIcon />
            <LocaleLink to={URLS.WRITE} className="contribute-link">
              <Localized id="write" />
            </LocaleLink>
            {speakActive && <span className="border" />}
          </li>
        </ul>
      </div>
    </div>
  );
};
