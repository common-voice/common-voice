import { Localized } from '@fluent/react';
import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';
import { NavLink } from 'react-router-dom';
import { User } from '../../../stores/user';
import StateTree from '../../../stores/tree';
import URLS from '../../../urls';
import { localeConnector, LocalePropsFromState } from '../../locale-helpers';
import {
  CameraIcon,
  CloudIcon,
  CogIcon,
  TrashIcon,
  UserIcon,
  UserPlusIcon,
} from '../../ui/icons';
import AvatarSetup from './avatar-setup/avatar-setup';
import DeleteProfile from './delete/delete';
import InfoPage from './info/info';
import Settings from './settings/settings';

import './layout.css';
import DownloadProfile, { downloadTextAsFile, getProfileInfo } from './download/download';

interface PropsFromState {
  user: User.State;
}

interface Props extends LocalePropsFromState, PropsFromState {}

const Layout = ({ toLocaleRoute, user }: Props) => {
  if (window.location.search.includes('enableNewDownload=1')) {
    try {
      sessionStorage.setItem('downloadEnabled', 'true');
    } catch(e) {
      console.warn(`A sessionStorage error occurred ${e.message}`);
    }
  }
  const downloadEnabled = sessionStorage.getItem('downloadEnabled');

  const [infoRoute, avatarRoute, prefRoute, deleteRoute, downloadRoute] = [
    URLS.PROFILE_INFO,
    URLS.PROFILE_AVATAR,
    URLS.PROFILE_SETTINGS,
    URLS.PROFILE_DELETE,
    URLS.PROFILE_DOWNLOAD,
  ].map(r => toLocaleRoute(r));
  return (
    <div className="profile-layout">
      <div className="profile-nav">
        <div className="links">
          {[
            {
              route: infoRoute,
              ...(user.account
                ? { icon: <UserIcon />, id: 'profile' }
                : { icon: <UserPlusIcon />, id: 'build-profile' }),
            },
            { route: avatarRoute, icon: <CameraIcon />, id: 'avatar' },
            { route: prefRoute, icon: <CogIcon />, id: 'settings' },
            {
              route: deleteRoute,
              icon: <TrashIcon />,
              id: 'profile-form-delete',
            },
            {
              route: downloadRoute,
              icon: <CloudIcon />,
              id: 'download-profile',
            },
          ]
            .slice(0, user.account ? Infinity : 1)
            .map(({ route, icon, id }) => (
              (route !== downloadRoute || downloadEnabled) ?
              (<NavLink key={route} to={route}>
                {icon}
                <Localized id={id}>
                  <span className="text" />
                </Localized>
              </NavLink>) : (
                <a key={route} onClick={() => downloadTextAsFile('profile.txt', getProfileInfo(user.account))} href="#">
                  <CloudIcon />
                  <Localized id="download-profile">
                    <span className="text" />
                  </Localized>
                </a>
            )))}
        </div>
      </div>
      <div className="content">
        <Switch>
          <Route exact path={infoRoute} component={InfoPage} />
          {[
            { route: avatarRoute, Component: AvatarSetup },
            { route: prefRoute, Component: Settings },
            { route: deleteRoute, Component: DeleteProfile },
            { route: downloadRoute, Component: DownloadProfile },
          ].map(({ route, Component }) => (
            (route !== downloadRoute || downloadEnabled) ?
            (<Route
              key={route}
              exact
              path={route}
              render={props =>
                user.account ? <Component /> : <Redirect to={infoRoute} />
              }
            />) : null
          ))}
          <Route
            render={() => <Redirect to={toLocaleRoute(URLS.PROFILE_INFO)} />}
          />
        </Switch>
      </div>
    </div>
  );
};

export default connect<PropsFromState>(({ user }: StateTree) => ({ user }))(
  localeConnector(Layout)
);
