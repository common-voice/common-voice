import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import { trackNav } from '../../services/tracker';
import { Locale } from '../../stores/locale';
import StateTree from '../../stores/tree';
import { User } from '../../stores/user';
import URLS from '../../urls';
import { LocaleLink } from '../locale-helpers';
import {
  CogIcon,
  DashboardIcon,
  DownIcon,
  LogoutIcon,
  UserIcon,
} from '../ui/icons';
import { Avatar, Hr } from '../ui/ui';

import './user-menu.css';

interface PropsFromState {
  locale: Locale.State;
  user: User.State;
}

function UserMenu({ locale, user: { account } }: PropsFromState) {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div
      className={'user-menu ' + (showMenu ? 'active' : '')}
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}>
      <button className="toggle" onClick={() => setShowMenu(!showMenu)}>
        <Avatar url={account.avatar_url} />
        <span className="name" title={account.username}>
          {account.username}
        </span>
        <DownIcon />
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
  );
}

const mapStateToProps = (state: StateTree) => ({
  locale: state.locale,
  user: state.user,
});

export default connect<PropsFromState>(mapStateToProps)(UserMenu);
