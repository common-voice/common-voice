import { Localized } from '@fluent/react';
import classNames from 'classnames';
import * as React from 'react';
import { trackNav, getTrackClass } from '../../services/tracker';
import URLS from '../../urls';
import {
  ContributableLocaleLock,
  LocaleLink,
  LocaleNavLink,
  useLocale,
} from '../locale-helpers';
import { ChevronDown, ListenIcon, MicIcon } from '../ui/icons';

import './nav.css';

const LocalizedNavLink = ({ id, to }: { id: string; to: string }) => {
  const [locale] = useLocale();
  return (
    <Localized id={id}>
      <LocaleNavLink
        className={getTrackClass('fs', id)}
        to={to}
        exact
        onClick={() => trackNav(id, locale)}
      />
    </Localized>
  );
};

export default function Nav({ children, ...props }: { [key: string]: any }) {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <nav {...props} className="nav-list">
      <div className="nav-links">
        <ContributableLocaleLock>
          <div
            className={classNames('contribute-menu', { active: showMenu })}
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}>
            <p className="nav-link-item">
              <Localized id="contribute" />
            </p>
            <ChevronDown className={classNames({ 'rotate-180': showMenu })} />
            <div className="nav-menu-wrap">
              <div className="menu">
                <span className="blue-border" />
                <ul>
                  <Localized id="contribute-nav-item-header-1">
                    <p />
                  </Localized>
                  <li>
                    <MicIcon />
                    <LocaleLink to={URLS.SPEAK}>
                      <Localized id="speak" />
                    </LocaleLink>
                  </li>
                  <li>
                    <ListenIcon />
                    <LocaleLink to={URLS.LISTEN}>
                      <Localized id="listen" />
                    </LocaleLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </ContributableLocaleLock>
        <LocalizedNavLink id="datasets" to={URLS.DATASETS} />
        <LocalizedNavLink id="languages" to={URLS.LANGUAGES} />
        <LocalizedNavLink id="partner" to={URLS.PARTNER} />
        <LocalizedNavLink id="about" to={URLS.ABOUT} />
      </div>
      {children}
    </nav>
  );
}
