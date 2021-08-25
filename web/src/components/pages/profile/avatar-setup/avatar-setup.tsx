import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react';
import * as React from 'react';
import { connect } from 'react-redux';
import API from '../../../../services/api';
import { trackProfile } from '../../../../services/tracker';
import { Locale } from '../../../../stores/locale';
import { Notifications } from '../../../../stores/notifications';
import StateTree from '../../../../stores/tree';
import { User } from '../../../../stores/user';
import { Uploads } from '../../../../stores/uploads';
import { CheckIcon, LinkIcon } from '../../../ui/icons';

import './avatar-setup.css';

const MAX_FILE_SIZE_KB = 300; // Max file upload size 300kb

function resizeImage(file: File, maxSize: number): Promise<Blob> {
  const reader = new FileReader();
  const image = new Image();
  const canvas = document.createElement('canvas');
  const dataURItoBlob = (dataURI: string) => {
    const bytes =
      dataURI.split(',')[0].indexOf('base64') >= 0
        ? atob(dataURI.split(',')[1])
        : unescape(dataURI.split(',')[1]);
    const mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const max = bytes.length;
    const ia = new Uint8Array(max);
    for (var i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
    return new Blob([ia], { type: mime });
  };

  const resize = () => {
    const canvasResize = document.createElement('canvas');

    let width = image.width;
    let height = image.height;
    let offsetX = 0;
    let offsetY = 0;

    // resize to the smaller dimension
    if (width < height) {
      if (width > maxSize) {
        height *= maxSize / width;
        width = maxSize;
        offsetY = (height - maxSize) / 2;
      }
    } else {
      if (height > maxSize) {
        width *= maxSize / height;
        height = maxSize;
        offsetX = (width - maxSize) / 2;
      }
    }

    canvasResize.width = width;
    canvasResize.height = height;
    canvasResize.getContext('2d').drawImage(image, 0, 0, width, height);

    return dataURItoBlob(canvasResize.toDataURL('image/jpg', 0.7));
  };

  return new Promise((ok, no) => {
    if (!file || !file.type.match(/image.*/)) {
      no(new Error('Not an image'));
      return;
    }

    if (file.size > MAX_FILE_SIZE_KB * 1024) {
      no(new Error('too_large'));
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
  addUpload: typeof Uploads.actions.add;
}

interface Props
  extends WithLocalizationProps,
    PropsFromState,
    PropsFromDispatch {}

interface State {
  isSaving: boolean;
}

class AvatarSetup extends React.Component<Props, State> {
  state: State = {
    isSaving: false,
  };

  async saveFileAvatar(files: FileList) {
    const { addNotification, api, getString, locale, refreshUser } = this.props;
    this.setState({ isSaving: true });

    try {
      const image = await resizeImage(files.item(0), 200);
      await api.saveAvatar('file', image);
      addNotification(getString('avatar-uploaded'));
      trackProfile('give-avatar', locale);
      refreshUser();
    } catch (e) {
      if (e.message.includes('too_large')) {
        addNotification(getString('file_' + e.message));
      } else {
        addNotification(e.message);
      }
    }

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
      <div className="full-avatar-setup">
        {account.avatar_url && (
          <div className="avatar-current">
            <div className="avatar-wrap">
              <img src={account.avatar_url} />
            </div>
          </div>
        )}
        <fieldset className="photo-avatar" disabled={this.state.isSaving}>
          <div className="file-upload">
            <label
              onDragOver={event => {
                event.preventDefault();
              }}
              onDrop={event => {
                this.saveFileAvatar(event.dataTransfer.files);
                event.preventDefault();
              }}>
              <span className="title">
                <Localized id="browse-file-title" /> (
                <Localized id="max-file-size" vars={{ kb: MAX_FILE_SIZE_KB }} />
                )
              </span>
              <Localized
                id="browse-file"
                elems={{ browseWrap: <span className="browse" /> }}>
                <span className="upload-label" />
              </Localized>
              <input
                className="hide-input"
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
      </div>
    );
  }
}

export default connect<PropsFromState, any>(
  ({ api, locale, user }: StateTree) => ({ api, locale, user }),
  {
    addNotification: Notifications.actions.addPill,
    refreshUser: User.actions.refresh,
    addUpload: Uploads.actions.add,
  }
)(withLocalization(AvatarSetup));
