import { Localized } from '@fluent/react';
import classNames from 'classnames';
import React from 'react';

import { LocaleNavLink } from '../../locale-helpers';
import { ListenIcon, MenuIcon, MicIcon } from '../../ui/icons';
import URLS from '../../../urls';

type SecondaryNavProps = {
  isDemoMode: boolean;
  handleSecondaryNavMobileMenuClick: () => void;
};

export const SecondaryNav: React.FC<SecondaryNavProps> = ({
  isDemoMode,
  handleSecondaryNavMobileMenuClick,
}) => (
  <div className="secondary-nav">
    <MenuIcon onClick={handleSecondaryNavMobileMenuClick} />
    <div className="options">
      <div
        className={classNames({
          'selected-option': location.pathname.includes(URLS.SPEAK),
        })}>
        <MicIcon />
        <Localized id="speak">
          <LocaleNavLink to={isDemoMode ? URLS.DEMO_SPEAK : URLS.SPEAK} />
        </Localized>
        {location.pathname.includes(URLS.SPEAK) && <span className="border" />}
      </div>
      <div
        className={classNames({
          'selected-option': location.pathname.includes(URLS.LISTEN),
        })}>
        <ListenIcon />
        <Localized id="listen">
          <LocaleNavLink to={isDemoMode ? URLS.DEMO_LISTEN : URLS.LISTEN} />
        </Localized>
        {location.pathname.includes(URLS.LISTEN) && <span className="border" />}
      </div>
    </div>
  </div>
);
