import * as React from 'react';
import { Route, Switch } from 'react-router';
import { NavLink } from 'react-router-dom';
import URLS from '../../../urls';
import { localeConnector, LocalePropsFromState } from '../../locale-helpers';
import InfoPage from './info/info';

export default localeConnector(({ toLocaleRoute }: LocalePropsFromState) => {
  const infoRoute = toLocaleRoute(URLS.PROFILE_INFO);
  const avatarRoute = toLocaleRoute(URLS.PROFILE_AVATAR);
  const prefRoute = toLocaleRoute(URLS.PROFILE_PREFERENCES);
  return (
    <div>
      <div className="links">
        <NavLink to={infoRoute}>Build Profile</NavLink>
        <NavLink to={avatarRoute}>Avatar</NavLink>
        <NavLink to={prefRoute}>Preferences</NavLink>
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
