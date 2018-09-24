import * as React from 'react';
import { Route, Switch } from 'react-router';
import { NavLink } from 'react-router-dom';
import URLS from '../../../urls';
import { localeConnector, LocalePropsFromState } from '../../locale-helpers';
import { CameraIcon, ToggleIcon, UserIcon } from '../../ui/icons';
import InfoPage from './info/info';

import './layout.css';

export default localeConnector(({ toLocaleRoute }: LocalePropsFromState) => {
  const infoRoute = toLocaleRoute(URLS.PROFILE_INFO);
  const avatarRoute = toLocaleRoute(URLS.PROFILE_AVATAR);
  const prefRoute = toLocaleRoute(URLS.PROFILE_PREFERENCES);
  return (
    <div className="profile-layout">
      <div className="profile-nav">
        <div className="links">
          <NavLink to={infoRoute}>
            <UserIcon />
            <span className="text">Build Profile</span>
          </NavLink>
          <NavLink to={avatarRoute}>
            <CameraIcon />
            <span className="text">Avatar</span>
          </NavLink>
          <NavLink to={prefRoute}>
            <ToggleIcon />
            <span className="text">Preferences</span>
          </NavLink>
        </div>
      </div>
      <div className="content">
        <Switch>
          <Route exact path={infoRoute} component={InfoPage} />
          <Route exact path={avatarRoute} />
          <Route exact path={prefRoute} />
        </Switch>
      </div>
    </div>
  );
});
