import { Localized } from '@fluent/react/compat';
import * as React from 'react';
import { Suspense, lazy } from 'react';
import { useState } from 'react';
import { useAccount } from '../../hooks/store-hooks';
import { trackNav, trackVoiceAvatar } from '../../services/tracker';
import URLS from '../../urls';
import { LocaleLink, useLocale } from '../locale-helpers';
import {
  CogIcon,
  DashboardIcon,
  LogoutIcon,
  MenuIcon,
  UserIcon,
} from '../ui/icons';
import { Avatar, Hr } from '../ui/ui';

import './user-menu.css';
const Lottie = lazy(() => import('react-lottie'));
const animationData = require('./data.json');

export default function UserMenu() {
  const playAvatar = () => {
    trackVoiceAvatar('self-listen', locale);
    if (account.avatar_clip_url !== null && !showAnimation) {
      audioRef.current.src = account.avatar_clip_url;

      audioRef.current.play();
      setShowAnimation(!showAnimation);
    } else if (account.avatar_clip_url !== null && showAnimation) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setShowAnimation(!showAnimation);
    }
  };

  const audioRef = React.createRef<HTMLAudioElement>();
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
        <audio
          preload="auto"
          ref={audioRef}
          onEnded={() => setShowAnimation(false)}
          onError={() => setShowAnimation(false)}
        />
        <button className="toggle">
          <div
            className="username-btn"
            onMouseEnter={playAvatar}
            onMouseLeave={playAvatar}
            onClick={playAvatar}>
            <div>
              <Avatar url={account.avatar_url} />
            </div>
            <span className="name" title={account.username}>
              {account.username}
            </span>
          </div>
          <MenuIcon className={showMenu ? 'active' : ''} />
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
      <Suspense fallback={<div></div>}>
        <div className="animation">
          {showAnimation && (
            <div className="lottie-size">
              <Lottie options={defaultOptions} eventListeners={[]} />
            </div>
          )}
        </div>
      </Suspense>
    </div>
  );
}
