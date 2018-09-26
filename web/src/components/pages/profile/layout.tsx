import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';
import { NavLink } from 'react-router-dom';
import { User } from '../../../stores/user';
import StateTree from '../../../stores/tree';
import URLS from '../../../urls';
import { localeConnector, LocalePropsFromState } from '../../locale-helpers';
import { CameraIcon, ToggleIcon, UserIcon } from '../../ui/icons';
import InfoPage from './info/info';
import Preferences from './preferences/preferences';

import './layout.css';

interface PropsFromState {
  user: User.State;
}

interface Props extends LocalePropsFromState, PropsFromState {}

const Layout = ({ toLocaleRoute, user }: Props) => {
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
          {false && (
            <NavLink to={avatarRoute}>
              <CameraIcon />
              <span className="text">Avatar</span>
            </NavLink>
          )}
          <NavLink to={prefRoute}>
            <ToggleIcon />
            <span className="text">Preferences</span>
          </NavLink>
        </div>
      </div>
      <div className="content">
        <Switch>
          <Route exact path={infoRoute} component={InfoPage} />
          {false && (
            <Route
              exact
              path={avatarRoute}
              render={props =>
                user.account ? null : <Redirect to={infoRoute} />
              }
            />
          )}
          <Route
            exact
            path={prefRoute}
            render={props =>
              user.account ? <Preferences /> : <Redirect to={infoRoute} />
            }
          />
        </Switch>
      </div>
    </div>
  );
};
export default connect<PropsFromState>(({ user }: StateTree) => ({ user }))(
  localeConnector(Layout)
);
