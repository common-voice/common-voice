import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { useState } from 'react';
import { useAccount } from '../../hooks/store-hooks';
import { trackNav } from '../../services/tracker';
import URLS from '../../urls';
import { LocaleLink, useLocale } from '../locale-helpers';
import {
  CogIcon,
  DashboardIcon,
  DownIcon,
  LogoutIcon,
  UserIcon,
} from '../ui/icons';
import { Avatar, Hr } from '../ui/ui';

import './user-menu.css';
import Lottie from 'react-lottie';
const animationData = require('./data.json');

export default function UserMenu() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const [locale] = useLocale();
  const account = useAccount();
  const [showMenu, setShowMenu] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  return (
    <div>
      <div
        className={'user-menu ' + (showMenu ? 'active' : '')}
        onMouseEnter={() => setShowMenu(true)}
        onMouseLeave={() => setShowMenu(false)}>
        <button
          className="toggle"
          title="click to play avatar"
          onClick={() => {
            if (account.avatar_clip_url !== null) {
              const audio = new Audio(account.avatar_clip_url);
              audio.play();
              setShowAnimation(!showAnimation);
              audio.onended = () => {
                setShowAnimation(false);
              };
              audio.onerror = () => {
                setShowAnimation(false);
              };
            }
            setShowMenu(!showMenu);
          }}>
          <div>
            <Avatar url={account.avatar_url} />
          </div>
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
      <div className="animation">
        {showAnimation && (
          <div>
            <Lottie options={defaultOptions} height={80} />
          </div>
        )}
      </div>
    </div>
  );
}
