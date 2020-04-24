import {
  Localized,
  LocalizationProps,
  withLocalization,
} from 'fluent-react/compat';
import * as React from 'react';
import { connect } from 'react-redux';
import API from '../../../../services/api';
import { trackProfile, trackVoiceAvatar } from '../../../../services/tracker';
import { Locale } from '../../../../stores/locale';
import { Notifications } from '../../../../stores/notifications';
import StateTree from '../../../../stores/tree';
import { User } from '../../../../stores/user';
import { Uploads } from '../../../../stores/uploads';
import {
  CheckIcon,
  LinkIcon,
  MicIcon,
  StopIcon,
  ShareIcon,
  RedoIcon,
  CrossIcon,
  TrashIcon,
} from '../../../ui/icons';
import { Button } from '../../../ui/ui';
import { Voice, PlayButton } from '../../../primary-buttons/primary-buttons';
import AudioIOS from '../../contribution/speak/audio-ios';
import AudioWeb, { AudioError } from '../../contribution/speak/audio-web';
import { isNativeIOS, isProduction } from '../../../../utility';
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
    if (!file || !file.type.match(/image.*/)) {
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
  addUpload: typeof Uploads.actions.add;
}

interface Props extends LocalizationProps, PropsFromState, PropsFromDispatch {}

interface State {
  isSaving: boolean;
  isRecording: boolean;
  isPlaying: boolean;
  counter: number;
  clipStatus: 'fetching' | 'notStarted' | 'started' | 'starting' | 'recorded';
  blobUrl: Blob;
  avatarClipUrl: string | null;
}

class AvatarSetup extends React.Component<Props, State> {
  state: State = {
    isSaving: false,
    isRecording: false,
    isPlaying: false,
    counter: 3,
    clipStatus: 'fetching',
    blobUrl: new Blob(),
    avatarClipUrl: null,
  };

  audio: AudioWeb | AudioIOS;
  isUnsupportedPlatform = false;
  maxVolume = 0;
  recordingStartTime = 0;
  recordingStopTime = 0;
  avatarRecordedBlobUrl: any = null;
  audioRef = React.createRef<HTMLAudioElement>();

  async componentDidMount() {
    this.audio = isNativeIOS() ? new AudioIOS() : new AudioWeb();
    this.audio.setVolumeCallback(this.updateVolume.bind(this));

    if (
      !this.audio.isMicrophoneSupported() ||
      !this.audio.isAudioRecordingSupported()
    ) {
      this.isUnsupportedPlatform = true;
    }
    let clip;
    if (this.props.user.account.avatar_clip_url) {
      clip = await this.props.api.fetchAvatarClip();
    }
    if (clip) this.setState({ avatarClipUrl: clip });
    this.setState({ clipStatus: 'notStarted' });
  }

  async componentWillUnmount() {
    if (!this.state.isRecording) return;
    await this.audio.stop();
  }

  async saveFileAvatar(files: FileList) {
    const { addNotification, api, getString, locale, refreshUser } = this.props;
    this.setState({ isSaving: true });
    const image = await resizeImage(files.item(0), 200);
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
    const { locale } = this.props;
    trackVoiceAvatar('self-listen', locale);
    if (!this.state.isPlaying) {
      this.audioRef.current.src = this.state.avatarClipUrl;
      this.audioRef.current.play();
      this.setState({ isPlaying: true });
    } else {
      this.audioRef.current.pause();
      this.audioRef.current.currentTime = 0;
      this.setState({ isPlaying: false });
    }
  };

  private playRecordedAvatarClip = async () => {
    console.log(this.avatarRecordedBlobUrl);
    if (!this.state.isPlaying) {
      this.audioRef.current.src = this.avatarRecordedBlobUrl;
      this.audioRef.current.play();
      this.setState({ isPlaying: true });
    } else {
      this.audioRef.current.pause();
      this.audioRef.current.currentTime = 0;
      this.setState({ isPlaying: false });
    }
  };

  private handleRecordClick = async () => {
    if (this.state.isRecording) {
      this.saveRecording();
      return;
    }

    try {
      await this.startRecording();

      const clipTime = 5000;
      setTimeout(async () => {
        this.saveRecording();
      }, clipTime);
    } catch (err) {
      if (!(err in AudioError)) {
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
      isRecording: true,
    });
  };

  private saveRecording = () => {
    if (this.state.clipStatus === 'started') {
      const RECORD_STOP_DELAY = 500;
      setTimeout(async () => {
        const info = await this.audio.stop();
        this.avatarRecordedBlobUrl = info.url;
        this.setState({ blobUrl: info.blob, clipStatus: 'recorded' });
      }, RECORD_STOP_DELAY);
      this.recordingStopTime = Date.now();
      this.setState({
        isRecording: false,
      });
    }
  };

  private async uploadAvatarClip() {
    const { api, refreshUser, addNotification, addUpload } = this.props;
    addUpload([
      async () => {
        try {
          await api.saveAvatarClip(this.state.blobUrl);
          this.setState({ clipStatus: 'notStarted' });
          let clip = await this.props.api.fetchAvatarClip();
          if (clip) this.setState({ avatarClipUrl: clip });
        } catch (error) {
          confirm('Upload of this avatar clip keeps failing, keep retrying?');
        }
      },
      async () => {
        addNotification(
          <React.Fragment>
            <CheckIcon />{' '}
            <Localized id="clips-uploaded">
              <span />
            </Localized>
          </React.Fragment>
        );
      },
    ]);
    refreshUser();
  }

  private async deleteAvatarClip() {
    const { api, refreshUser, addNotification, addUpload } = this.props;

    try {
      await api.deleteAvatarClip();
      console.log('done');
      this.setState({ clipStatus: 'notStarted' });
      let clip = await this.props.api.fetchAvatarClip();
      this.setState({ avatarClipUrl: clip || null });
    } catch (error) {
      console.error(error);
    }

    refreshUser();
  }

  private counter = async () => {
    if (this.state.clipStatus !== 'notStarted') return;
    this.audio.release();
    await this.audio.init();
    this.setState({ clipStatus: 'starting', counter: 3 });
    const downloadTimer = setInterval(() => {
      let tl = this.state.counter - 1;
      this.setState({ counter: tl });
      if (this.state.counter <= 0 && this.state.clipStatus === 'starting') {
        this.setState({ clipStatus: 'started' });
        const { locale } = this.props;
        trackVoiceAvatar('create-voice-avatar', locale);
        this.handleRecordClick();
        clearInterval(downloadTimer);
      }
    }, 1000);
  };

  private updateAvatarClip = () => {
    this.setState({
      avatarClipUrl: null,
      counter: 3,
      clipStatus: 'notStarted',
    });
  };

  private cancelRecording = async () => {
    let clip = await this.props.api.fetchAvatarClip();
    clip
      ? this.setState({
          avatarClipUrl: clip,
          clipStatus: 'notStarted',
          isRecording: false,
        })
      : this.setState({ clipStatus: 'notStarted', isRecording: false });
  };

  render() {
    const {
      addNotification,
      api,
      getString,
      refreshUser,
      user: { account },
    } = this.props;
    const { isPlaying, counter, clipStatus, avatarClipUrl } = this.state;
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

    const hasClip = avatarClipUrl !== null;

    return (
      <div className="full-avatar-setup">
        {!isProduction() && (
          <div className="clip">
            <audio
              preload="auto"
              ref={this.audioRef}
              onEnded={() => this.setState({ isPlaying: false })}
              onError={() => this.setState({ isPlaying: false })}
            />
            {/*heading */}

            {clipStatus === 'notStarted' && hasClip && (
              <Localized id="change-your-avatar-clip">
                <h2 className="clip-title" />
              </Localized>
            )}
            {clipStatus === 'notStarted' && !hasClip && (
              <Localized id="avatar-clip-title">
                <h2 className="clip-title" />
              </Localized>
            )}
            {clipStatus === 'starting' && (
              <Localized id="avatar-clip-title">
                <h2 className="clip-title" />
              </Localized>
            )}
            {clipStatus === 'started' && (
              <Localized id="recording-in-progress">
                <h2 className="clip-title" />
              </Localized>
            )}
            {clipStatus === 'recorded' && (
              <Localized id="avatar-clip-recorded">
                <h2 className="clip-title" />
              </Localized>
            )}
            {/* Below fix div is for middle content of avatar setup like wave image, lottie animation */}
            <div className="fix">
              {(clipStatus === 'notStarted' || clipStatus === 'starting') &&
                (hasClip ? (
                  <div className="group-1">
                    <div className="counter">
                      <PlayButton
                        isPlaying={isPlaying}
                        onClick={this.playAvatarClip}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="group-1">
                    {clipStatus === 'starting' && (
                      <div className="counter">
                        <Voice>
                          <div
                            className={
                              'counter-animation ' +
                              (counter === 2 ? 'counter-2 ' : '') +
                              (counter === 1 ? 'counter-1 ' : '') +
                              (counter <= 0 ? 'counter-0 ' : '')
                            }>
                            <div>
                              <span className="start-in">
                                Start in{' '}
                                <p className="counter-digit">{counter}</p>
                              </span>
                            </div>
                          </div>
                        </Voice>
                      </div>
                    )}
                  </div>
                ))}
              {clipStatus === 'started' && (
                <Suspense fallback={<div />}>
                  <div className="lottie">
                    <Lottie options={defaultOptions} eventListeners={[]} />
                    <div className="recording-stop">
                      <PlayButton
                        isPlaying={true}
                        onClick={this.handleRecordClick}
                      />
                    </div>
                  </div>
                </Suspense>
              )}
              {clipStatus === 'recorded' && (
                <div className="lottiebg">
                  <div className="recorded-play">
                    <PlayButton
                      isPlaying={isPlaying}
                      onClick={this.playRecordedAvatarClip}
                    />
                  </div>
                </div>
              )}
            </div>
            {/* ALL buttons, first page delete and re-record buttons */}
            {clipStatus === 'notStarted' && hasClip && (
              <div>
                <div className="but">
                  <div>
                    <Button
                      outline
                      rounded
                      className="primary-3 rerecord-but"
                      onClick={this.updateAvatarClip}>
                      <MicIcon />
                      <Localized id="re-record">
                        <span />
                      </Localized>
                    </Button>
                  </div>
                  <div>
                    <Button
                      outline
                      rounded
                      className="primary-2 delete-but"
                      onClick={this.deleteAvatarClip.bind(this)}>
                      <TrashIcon />
                      <Localized id="delete-voice">
                        <span />
                      </Localized>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {clipStatus === 'notStarted' && !hasClip && (
              <Button
                outline
                rounded
                className="primary rerecord-but"
                onClick={this.counter}>
                <MicIcon />
                <Localized id="record-voice-wave">
                  <span />
                </Localized>
              </Button>
            )}
            {clipStatus === 'starting' && !hasClip && (
              <Button
                outline
                rounded
                className="primary cancel-but"
                onClick={this.cancelRecording}>
                <CrossIcon />
                <Localized id="cancel-avatar-clip-recording">
                  <span />
                </Localized>
              </Button>
            )}
            {clipStatus === 'started' && (
              <Button
                outline
                rounded
                className="primary cancel-but"
                onClick={this.cancelRecording}>
                <CrossIcon />
                <Localized id="cancel-avatar-clip-recording">
                  <span />
                </Localized>
              </Button>
            )}
            {clipStatus === 'recorded' && (
              <div>
                <div className="but">
                  <div>
                    <Button
                      outline
                      rounded
                      className="primary-3 "
                      onClick={this.cancelRecording}>
                      <MicIcon />
                      <Localized id="retry-voice-wave-recording">
                        <span />
                      </Localized>
                    </Button>
                  </div>
                  <div>
                    <Button
                      outline
                      rounded
                      className="primary-2 "
                      onClick={this.uploadAvatarClip.bind(this)}>
                      <ShareIcon />
                      <Localized id="ready-to-upload">
                        <span />
                      </Localized>
                    </Button>
                  </div>
                </div>
                <div className="delete-voice">
                  <Localized id="delete-voice-clip">
                    <p
                      className="delete-voice"
                      onClick={this.deleteAvatarClip.bind(this)}
                    />
                  </Localized>
                </div>
              </div>
            )}
            {hasClip ? (
              <>
                <Localized id="avatar-clip-fact">
                  <p className="create-a-custom-voice" />
                </Localized>
              </>
            ) : (
              <Localized id="about-avatar-clip-recording">
                <p className="create-a-custom-voice voice-paragraph-2" />
              </Localized>
            )}
          </div>
        )}
        <div className="photo-avatar">
          <fieldset className="avatar-setup" disabled={this.state.isSaving}>
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
    addUpload: Uploads.actions.add,
  }
)(withLocalization(AvatarSetup));
