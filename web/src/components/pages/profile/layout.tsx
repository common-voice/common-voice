import { Localized } from 'fluent-react/compat';
import pick = require('lodash.pick');
import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';
import { UserClient } from '../../../../../common/user-clients';
import { NavLink } from 'react-router-dom';
import { User } from '../../../stores/user';
import StateTree from '../../../stores/tree';
import URLS from '../../../urls';
import { localeConnector, LocalePropsFromState } from '../../locale-helpers';
import { CameraIcon, ToggleIcon, UserIcon } from '../../ui/icons';
import { Button } from '../../ui/ui';
import AvatarSetup from './avatar-setup/avatar-setup';
import InfoPage from './info/info';
import Preferences from './preferences/preferences';

import './layout.css';

function downloadData(account: UserClient) {
  const text = [
    ...Object.entries(pick(account, 'email', 'username', 'age', 'gender')),
    ...account.locales.reduce((all, l, i) => {
      const localeLabel = 'language ' + (i + 1);
      return [
        ...all,
        [localeLabel, l.locale],
        [localeLabel + ' accent', l.accent],
      ];
    }, []),
  ]
    .map(([key, value]) => key + ': ' + value)
    .join('\n');

  const element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
  );
  element.setAttribute('download', 'profile.txt');

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

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
            <span className="text">{user.account ? '' : 'Build '}Profile</span>
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

        {user.account && (
          <div className="buttons">
            <Localized id="download-profile">
              <Button
                rounded
                outline
                onClick={() => downloadData(user.account)}
              />
            </Localized>
          </div>
        )}
      </div>
      <div className="content">
        <Switch>
          <Route exact path={infoRoute} component={InfoPage} />
          <Route
            exact
            path={avatarRoute}
            render={props =>
              user.account ? <AvatarSetup /> : <Redirect to={infoRoute} />
            }
          />
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
