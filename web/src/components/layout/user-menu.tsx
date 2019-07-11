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

function Animation() {
  return (
    <div className="cover">
      <section>
        <div className="wave top"></div>
        <canvas className="wavea mid" id="bars"></canvas>
      </section>
    </div>
  );
}

function ani(d: any) {
  console.log(d);
  var canvas = d.current;
  var ctx = canvas.getContext('2d');

  var pos = [
    [
      60,
      80,
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
      60,
      80,
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
      60,
      80,
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
      60,
      80,
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
      60,
      80,
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
      60,
      80,
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
    ],
    [
      160,
      140,
      120,
      100,
      80,
      60,
      80,
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
      60,
      80,
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
      60,
      80,
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
      60,
      80,
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
      60,
      80,
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
      60,
      80,
      100,
      120,
      140,
    ],
    [
      120,
      140,
      160,
      140,
      120,
      100,
      80,
      60,
      80,
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
      60,
      80,
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
      60,
      80,
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
      60,
      80,
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
      60,
      80,
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
      60,
      80,
      100,
    ],
    [
      60,
      80,
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
      60,
      80,
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
      60,
      80,
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
      60,
      80,
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
      60,
      80,
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
      60,
      80,
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
    ],
    [
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
      60,
      80,
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
      60,
      80,
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
      60,
      80,
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
      60,
      80,
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
      60,
      80,
      100,
      120,
      140,
      160,
      140,
      120,
      100,
      80,
      60,
      80,
    ],
  ];

  var t = 0;
  doit();
  setInterval(doit, 150);
  function doit() {
    //window.webkitRequestAnimationFrame(doit)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    for (var j = 0; j < 55; j++) {
      var position = j * 5;
      position = position + 20;
      var width = 0.5;
      var height = -(pos[t][j] / 2);
      ctx.fillRect(position, canvas.height, width, height);
    }
    t++;
    if (t === 5) t = 0;
    console.log(t);
  }
}

export default function UserMenu() {
  const canvasRef: { current: HTMLCanvasElement | null } = React.createRef();
  const [locale] = useLocale();
  const account = useAccount();
  console.log(account.avatar_url, 'logged account');
  const [showMenu, setShowMenu] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  return (
    <div>
      <div
        className={'user-menu ' + (showMenu ? 'active' : '')}
        onMouseEnter={() => setShowMenu(true)}
        onMouseLeave={() => setShowMenu(false)}>
        <button className="toggle" onClick={() => setShowMenu(!showMenu)}>
          <div onClick={() => ani(canvasRef)}>
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
      <div className="test">
        {!showAnimation && (
          <div className="cover">
            <section>
              <div className="wave top"></div>
              <canvas ref={canvasRef} className="wavea mid" id="bars"></canvas>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
