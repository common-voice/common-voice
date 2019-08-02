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
import {
  CheckIcon,
  LinkIcon,
  MicIcon,
  StopIcon,
  PlayIcon,
  ShareIcon,
  RedoIcon,
} from '../../../ui/icons';
import { Button } from '../../../ui/ui';
import { Voice, PlayButton } from '../../../primary-buttons/primary-buttons';
import AudioIOS from '../../contribution/speak/audio-ios';
import AudioWeb, { AudioError } from '../../contribution/speak/audio-web';
import { isFirefoxFocus, isNativeIOS, isProduction } from '../../../../utility';
import { Suspense, lazy } from 'react';
const Lottie = lazy(() => import('react-lottie'));
const animationData = require('../../../layout/data.json');

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
<MicIcon />;

interface Props extends LocalizationProps, PropsFromState, PropsFromDispatch {}

class AvatarSetup extends React.Component<Props> {
  state = {
    isSaving: false,
    recordingStatus: false,
    avatarClipPlaying: false,
    counter: 3,
    clipStatus: 'notStarted',
    blobUrl: new Blob(),
    avatarClipUrl: 'empty',
  };

  audio: AudioWeb | AudioIOS;
  isUnsupportedPlatform = false;
  maxVolume = 0;
  recordingStartTime = 0;
  recordingStopTime = 0;
  //avatarClipUrl: any = null;

  async componentDidMount() {
    this.audio = isNativeIOS() ? new AudioIOS() : new AudioWeb();
    this.audio.setVolumeCallback(this.updateVolume.bind(this));

    if (
      !this.audio.isMicrophoneSupported() ||
      !this.audio.isAudioRecordingSupported() ||
      isFirefoxFocus()
    ) {
      this.isUnsupportedPlatform = true;
    }
    let clip = await this.props.api.fetchAvatarClip();
    if (clip) this.setState({ avatarClipUrl: clip });
  }

  async componentWillUnmount() {
    if (!this.state.recordingStatus) return;
    await this.audio.stop();
  }

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

  private updateVolume = (volume: number) => {
    if (volume !== 100 && volume > this.maxVolume) {
      this.maxVolume = volume;
    }
  };

  private playAvatarClip = async () => {
    const audio = new Audio(this.state.avatarClipUrl);
    this.setState({ avatarClipPlaying: true });
    audio.play();
    audio.onended = () => this.setState({ avatarClipPlaying: false });
    audio.onerror = () => this.setState({ avatarClipPlaying: false });
  };

  private handleRecordClick = async () => {
    if (this.state.recordingStatus) {
      this.saveRecording();
      return;
    }

    try {
      await this.audio.init();
      await this.startRecording();

      const clipTime = 5000;
      setTimeout(async () => {
        this.saveRecording();
      }, clipTime);
    } catch (err) {
      if (err in AudioError) {
        this.setState({ error: err });
      } else {
        throw err;
      }
    }
  };

  private startRecording = async () => {
    await this.audio.start();
    this.maxVolume = 0;
    this.recordingStartTime = Date.now();
    this.recordingStopTime = 0;
    this.setState({
      // showSubmitSuccess: false,
      recordingStatus: true,
      error: null,
    });
  };

  private saveRecording = () => {
    const RECORD_STOP_DELAY = 500;
    setTimeout(async () => {
      const info = await this.audio.stop();
      this.setState({ blobUrl: info.blob });
      this.setState({ clipStatus: 'recorded' });
      //this.uploadAvatarClip(info.blob);
    }, RECORD_STOP_DELAY);
    this.recordingStopTime = Date.now();
    this.setState({
      recordingStatus: false,
    });
  };

  private uploadAvatarClip() {
    const { api, refreshUser, addNotification } = this.props;
    api
      .saveAvatarClip(this.state.blobUrl)
      .then(data => {
        //this.setState({ clipStatus: 'notStarted', counter: 0 });
        addNotification(
          <React.Fragment>
            <CheckIcon />{' '}
            <Localized id="clips-uploaded">
              <span />
            </Localized>
          </React.Fragment>
        );
      })
      .catch(err => {
        confirm('Upload of this avatar clip keeps failing, keep retrying?');
      });
    refreshUser();
  }

  private counter = () => {
    this.setState({ clipStatus: 'starting', counter: 3 });
    var downloadTimer = setInterval(() => {
      let tl = this.state.counter - 1;
      this.setState({ counter: tl });
      if (this.state.counter <= 0) {
        this.setState({ clipStatus: 'started' });
        this.handleRecordClick();
        clearInterval(downloadTimer);
      }
    }, 1000);
  };

  private updateAvatarClip = () => {
    this.setState({ avatarClipUrl: 'empty', counter: 3 });
  };

  private cancelRecording = async () => {
    let clip = await this.props.api.fetchAvatarClip();
    if (clip) this.setState({ avatarClipUrl: clip });
    this.setState({ clipStatus: 'notStarted' });
  };

  render() {
    const {
      addNotification,
      api,
      getString,
      refreshUser,
      user: { account },
    } = this.props;
    const {
      recordingStatus,
      avatarClipPlaying,
      counter,
      clipStatus,
      avatarClipUrl,
    } = this.state;
    const avatarType =
      account.avatar_url &&
      account.avatar_url.startsWith('https://gravatar.com')
        ? 'gravatar'
        : null;

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    };

    console.log(avatarClipUrl);
    return (
      <div className="full-avatar-setup">
        <div className="clip">
          <Localized id="add-avatar-clip">
            <h2 className="clip-title" />
          </Localized>
          {/* Below fix div is for middle content of avatar setup like wave image, lottie animation */}
          <div className="fix">
            {(clipStatus === 'notStarted' || clipStatus === 'starting') &&
              (avatarClipUrl === 'empty' ? (
                <div>
                  <div className="Group-1">
                    {true && (
                      <div className="counter">
                        <Voice>
                          <span className="Start-in">
                            Start in <p className="counter-digit">{counter}</p>
                          </span>
                        </Voice>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="Group-1">
                    <div className="counter">
                      <PlayButton
                        isPlaying={avatarClipPlaying}
                        onClick={this.playAvatarClip}
                      />
                    </div>
                  </div>
                </div>
              ))}
            {clipStatus === 'started' && (
              <div>
                <Suspense fallback={<div></div>}>
                  <div className="lottie">
                    <Lottie
                      options={defaultOptions}
                      eventListeners={[]}
                      width={508}
                    />
                  </div>
                </Suspense>
              </div>
            )}
            {clipStatus === 'recorded' && <div className="lottiebg"></div>}
          </div>
          {(clipStatus === 'notStarted' || clipStatus === 'starting') &&
            (avatarClipUrl === 'empty' && (
              <div>
                <Button
                  outline
                  rounded
                  className="Primary "
                  onClick={this.counter}>
                  <MicIcon />
                  <Localized id="create-voice-wave">
                    <span />
                  </Localized>
                </Button>
              </div>
            ))}
          {clipStatus === 'started' && (
            <Button
              outline
              rounded
              className="Primary "
              onClick={this.handleRecordClick}>
              <StopIcon />
              <Localized id="recording-voice-wave"></Localized>
            </Button>
          )}
          {clipStatus === 'recorded' && (
            <div className="but">
              <Button
                outline
                rounded
                className="Primary-3 "
                onClick={this.cancelRecording}>
                <RedoIcon />
                <Localized id="cancel-avatar-clip-recording"></Localized>
              </Button>
              <Button
                outline
                rounded
                className="Primary-2 "
                onClick={this.uploadAvatarClip.bind(this)}>
                <ShareIcon />
                <Localized id="ready-to-upload"></Localized>
              </Button>
            </div>
          )}
          {avatarClipUrl === 'empty' ? (
            <Localized id="about-avatar-clip">
              <p className="Create-a-custom-voic" />
            </Localized>
          ) : (
            <div>
              <Localized id="avatar-clip-fact">
                <p className="Create-a-custom-voic" />
              </Localized>
              <Localized id="recreate-voice">
                <p className="recreate-voice" onClick={this.updateAvatarClip} />
              </Localized>
            </div>
          )}
        </div>
        <div>
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
      </div>
    );
  }
}

export default connect<PropsFromState, any>(
  ({ api, locale, user }: StateTree) => ({ api, locale, user }),
  {
    addNotification: Notifications.actions.addPill,
    refreshUser: User.actions.refresh,
  }
)(withLocalization(AvatarSetup));
