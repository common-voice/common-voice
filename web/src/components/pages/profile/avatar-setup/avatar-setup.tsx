import {
  Localized,
  LocalizationProps,
  withLocalization,
} from 'fluent-react/compat';
import * as React from 'react';
import { connect } from 'react-redux';
import API from '../../../../services/api';
import { Notifications } from '../../../../stores/notifications';
import StateTree from '../../../../stores/tree';
import { User } from '../../../../stores/user';

import './avatar-setup.css';

interface PropsFromState {
  api: API;
  user: User.State;
}

interface PropsFromDispatch {
  addNotification: typeof Notifications.actions.add;
  refreshUser: typeof User.actions.refresh;
}

interface Props extends LocalizationProps, PropsFromState, PropsFromDispatch {}

const AvatarSetup = ({
  addNotification,
  api,
  getString,
  refreshUser,
  user: { account },
}: Props) => {
  const avatarType =
    account.avatar_url && account.avatar_url.startsWith('https://gravatar.com')
      ? 'gravatar'
      : null;
  return (
    <fieldset className="avatar-setup">
      <div className="file-upload">
        <label>
          <Localized id="browse-file" browseWrap={<span className="browse" />}>
            <span className="upload-label" />
          </Localized>
          <input type="file" />
        </label>
      </div>

      <Localized id="connect-gravatar">
        <button
          className={'connect ' + (avatarType == 'gravatar' ? 'active' : '')}
          type="button"
          onClick={async () => {
            const { error } = await api.saveAvatar(
              avatarType == 'gravatar' ? 'default' : 'gravatar'
            );

            if (['not_found'].includes(error)) {
              addNotification(getString('gravatar_' + error));
            }

            if (!error) {
              refreshUser();
            }
          }}
        />
      </Localized>
    </fieldset>
  );
};

export default connect<PropsFromState, PropsFromDispatch>(
  ({ api, user }: StateTree) => ({ api, user }),
  {
    addNotification: Notifications.actions.add,
    refreshUser: User.actions.refresh,
  }
)(withLocalization(AvatarSetup));
