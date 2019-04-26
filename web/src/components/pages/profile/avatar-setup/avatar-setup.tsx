import {
  Localized,
  LocalizationProps,
  withLocalization,
} from 'fluent-react/compat';
import * as React from 'react';
import { connect } from 'react-redux';
import API from '../../../../services/api';
import { trackProfile } from '../../../../services/tracker';
import { Locale } from '../../../../stores/locale';
import { Notifications } from '../../../../stores/notifications';
import StateTree from '../../../../stores/tree';
import { User } from '../../../../stores/user';
import { CheckIcon, LinkIcon } from '../../../ui/icons';

import './avatar-setup.css';

function resizeImage(file: File, maxSize: number): Promise<Blob> {
  const reader = new FileReader();
  const image = new Image();
  const canvas = document.createElement('canvas');
  const dataURItoBlob = (dataURI: string) => {
    const bytes =
      dataURI.split(',')[0].indexOf('base64') >= 0
        ? atob(dataURI.split(',')[1])
        : unescape(dataURI.split(',')[1]);
    const mime = dataURI
      .split(',')[0]
      .split(':')[1]
      .split(';')[0];
    const max = bytes.length;
    const ia = new Uint8Array(max);
    for (var i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
    return new Blob([ia], { type: mime });
  };
  const resize = () => {
    let width = image.width;
    let height = image.height;

    if (width > height) {
      if (width > maxSize) {
        height *= maxSize / width;
        width = maxSize;
      }
    } else {
      if (height > maxSize) {
        width *= maxSize / height;
        height = maxSize;
      }
    }

    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(image, 0, 0, width, height);
    let dataUrl = canvas.toDataURL('image/jpeg');
    return dataURItoBlob(dataUrl);
  };

  return new Promise((ok, no) => {
    if (!file.type.match(/image.*/)) {
      no(new Error('Not an image'));
      return;
    }

    reader.onload = (readerEvent: any) => {
      image.onload = () => ok(resize());
      image.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  });
}

interface PropsFromState {
  api: API;
  locale: Locale.State;
  user: User.State;
}

interface PropsFromDispatch {
  addNotification: typeof Notifications.actions.addPill;
  refreshUser: typeof User.actions.refresh;
}

interface Props extends LocalizationProps, PropsFromState, PropsFromDispatch {}

class AvatarSetup extends React.Component<Props> {
  state = { isSaving: false };

  async saveFileAvatar(files: FileList) {
    const { addNotification, api, getString, locale, refreshUser } = this.props;
    this.setState({ isSaving: true });
    const image = await resizeImage(files.item(0), 80);
    const { error } = await api.saveAvatar('file', image);
    if (['too_large'].includes(error)) {
      addNotification(getString('file' + error));
    }
    trackProfile('give-avatar', locale);
    refreshUser();
    this.setState({ isSaving: false });
  }

  render() {
    const {
      addNotification,
      api,
      getString,
      refreshUser,
      user: { account },
    } = this.props;
    const avatarType =
      account.avatar_url &&
      account.avatar_url.startsWith('https://gravatar.com')
        ? 'gravatar'
        : null;
    return (
      <fieldset className="avatar-setup" disabled={this.state.isSaving}>
        <Localized id="add-avatar-title">
          <h2 />
        </Localized>

        <div className="file-upload">
          <label
            onDragOver={event => {
              event.preventDefault();
            }}
            onDrop={event => {
              this.saveFileAvatar(event.dataTransfer.files);
              event.preventDefault();
            }}>
            <Localized id="browse-file-title">
              <span className="title" />
            </Localized>
            <Localized
              id="browse-file"
              browseWrap={<span className="browse" />}>
              <span className="upload-label" />
            </Localized>
            <input
              type="file"
              accept="image/*"
              onChange={event => {
                this.saveFileAvatar(event.target.files);
              }}
            />
          </label>
        </div>

        <button
          className="connect"
          type="button"
          onClick={async () => {
            this.setState({ isSaving: true });
            const { error } = await api.saveAvatar(
              avatarType == 'gravatar' ? 'default' : 'gravatar'
            );

            if (['not_found'].includes(error)) {
              addNotification(getString('gravatar_' + error));
            }

            if (!error) {
              refreshUser();
            }
            this.setState({ isSaving: false });
          }}>
          <Localized id="connect-gravatar">
            <span />
          </Localized>{' '}
          {avatarType == 'gravatar' ? (
            <CheckIcon className="check" />
          ) : (
            <LinkIcon className="link" />
          )}
        </button>
      </fieldset>
    );
  }
}

export default connect<PropsFromState, PropsFromDispatch>(
  ({ api, locale, user }: StateTree) => ({ api, locale, user }),
  {
    addNotification: Notifications.actions.addPill,
    refreshUser: User.actions.refresh,
  }
)(withLocalization(AvatarSetup));
