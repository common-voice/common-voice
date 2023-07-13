import { Localized } from '@fluent/react';
import classNames from 'classnames';
import * as React from 'react';
import { useState } from 'react';
import { useAccount } from '../../hooks/store-hooks';
import { trackNav } from '../../services/tracker';
import URLS from '../../urls';
import { LocaleLink, useLocale } from '../locale-helpers';
import {
  ChevronDown,
  CogIcon,
  DashboardIcon,
  LogoutIcon,
  UserIcon,
} from '../ui/icons';
import { Avatar, Hr } from '../ui/ui';

import './user-menu.css';

export default function UserMenu() {
  const [locale] = useLocale();
  const account = useAccount();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div>
      <div
        className={'user-menu ' + (showMenu ? 'active' : '')}
        onMouseEnter={() => setShowMenu(true)}
        onMouseLeave={() => setShowMenu(false)}>
        <button className="toggle">
          <div className="username-btn">
            <div>
              <Avatar url={account.avatar_url} />
            </div>
            <span className="name" title={account.username}>
              {account.username}
            </span>
          </div>
          <ChevronDown className={classNames({ 'rotate-180': showMenu })} />
        </button>
        <div className="menu-wrap">
          <div className="menu">
            <span className="triangle" />
            <ul>
              {[
                {
                  route: URLS.DASHBOARD,
                  icon: <DashboardIcon />,
                  id: 'dashboard',
                },
                {
                  route: URLS.PROFILE_INFO,
                  icon: <UserIcon />,
                  id: 'profile',
                },
                {
                  route: URLS.PROFILE_SETTINGS,
                  icon: <CogIcon />,
                  id: 'settings',
                },
              ].map(({ route, icon, id }) => (
                <li key={route}>
                  <LocaleLink to={route} onClick={() => trackNav(id, locale)}>
                    {icon}
                    <Localized id={id}>
                      <span />
                    </Localized>
                  </LocaleLink>
                  <Hr />
                </li>
              ))}
              <li>
                <a href="/logout">
                  <LogoutIcon />
                  <Localized id="logout">
                    <span />
                  </Localized>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
