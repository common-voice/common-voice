import * as React from 'react';
import classNames from 'classnames';
import { Localized } from '@fluent/react';

import { TextButton } from '../../ui/ui';
import { ChevronDown, ListenIcon, MicIcon } from '../../ui/icons';
import { LocaleLink } from '../../locale-helpers';
import URLS from '../../../urls';

type ContributeMenuProps = {
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  showMobileMenu: boolean;
  toggleMobileMenuVisible: () => void;
};

export const ContributeMenu: React.FC<ContributeMenuProps> = ({
  showMenu,
  setShowMenu,
  showMobileMenu,
  toggleMobileMenuVisible,
}) => {
  return (
    <div
      className={classNames('contribute-menu', { active: showMenu })}
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
      data-testid="contribute-menu">
      <div className="contribute-btn-wrapper">
        <Localized id="contribute">
          <TextButton
            className="contribute-btn"
            onClick={toggleMobileMenuVisible}
          />
        </Localized>
        <ChevronDown className={classNames({ 'rotate-180': showMobileMenu })} />
      </div>
      <div className="contribute-link-wrapper">
        <p className="nav-link-item">
          <Localized id="contribute" />
        </p>
        <ChevronDown className={classNames({ 'rotate-180': showMenu })} />
      </div>
      {showMobileMenu && (
        <div
          className="nav-menu-wrapper-mobile"
          data-testid="contribute-mobile-menu">
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
      <div className="nav-menu-wrapper" data-testid="nav-menu-wrapper">
        <div className="menu">
          <span className="blue-border" />
          <div className="menu-list">
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
  );
};
