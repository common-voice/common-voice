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
import { TextButton } from '../ui/ui';

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
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);

  const toggleMobileMenuVisible = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <nav {...props} className="nav-list">
      <div className="nav-links">
        <ContributableLocaleLock>
          <div
            className={classNames('contribute-menu', { active: showMenu })}
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}>
            <div className="contribute-btn-wrapper">
              <Localized id="contribute">
                <TextButton
                  className="contribute-btn"
                  onClick={toggleMobileMenuVisible}
                />
              </Localized>
              <ChevronDown
                className={classNames({ 'rotate-180': showMobileMenu })}
              />
            </div>
            <div className="contribute-link-wrapper">
              <p className="nav-link-item">
                <Localized id="contribute" />
              </p>
              <ChevronDown className={classNames({ 'rotate-180': showMenu })} />
            </div>
            {showMobileMenu && (
              <div className="nav-menu-wrapper-mobile">
                <div>
                  <Localized id="contribute-nav-header-item-1">
                    <p className="nav-header-item" />
                  </Localized>
                  <ul>
                    <li>
                      <MicIcon />
                      <LocaleLink to={URLS.SPEAK} className="contribute-link">
                        <Localized id="speak" />
                      </LocaleLink>
                    </li>
                    <li>
                      <ListenIcon />
                      <LocaleLink to={URLS.LISTEN} className="contribute-link">
                        <Localized id="listen" />
                      </LocaleLink>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            <div className="nav-menu-wrapper">
              <div className="menu">
                <span className="blue-border" />
                <div className="foo-class">
                  <Localized id="contribute-nav-header-item-1">
                    <p className="nav-header-item" />
                  </Localized>
                  <ul>
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
