import { LocalizationProps, Localized, withLocalization } from 'fluent-react';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
const NavigationPrompt = require('react-router-navigation-prompt').default;
import { Locale } from '../../../../stores/locale';
import { Notifications } from '../../../../stores/notifications';
import { Recordings } from '../../../../stores/recordings';
import StateTree from '../../../../stores/tree';
import { Uploads } from '../../../../stores/uploads';
import { User } from '../../../../stores/user';
import API from '../../../../services/api';
import { trackRecording } from '../../../../services/tracker';
import URLS from '../../../../urls';
import {
  localeConnector,
  LocaleLink,
  LocalePropsFromState,
} from '../../../locale-helpers';
import Modal, { ModalButtons } from '../../../modal/modal';
import { CheckIcon, FontIcon, MicIcon, StopIcon } from '../../../ui/icons';
import { Button, TextButton } from '../../../ui/ui';
import { getItunesURL, isFirefoxFocus, isNativeIOS } from '../../../../utility';
import AudioIOS from '../../record/audio-ios';
import AudioWeb, { AudioError, AudioInfo } from '../../record/audio-web';
import ContributionPage, {
  ContributionPillProps,
  SET_COUNT,
} from '../contribution';
import { RecordButton, RecordingStatus } from '../primary-buttons';
import RecordingPill from './recording-pill';

import './speak.css';

const MIN_RECORDING_MS = 300;
const MAX_RECORDING_MS = 10000;
const MIN_VOLUME = 1;

enum RecordingError {
  TOO_SHORT = 'TOO_SHORT',
  TOO_LONG = 'TOO_LONG',
  TOO_QUIET = 'TOO_QUIET',
}

const UnsupportedInfo = () => (
  <div className="unsupported">
    <Localized id="record-platform-not-supported">
      <h2 />
    </Localized>
    <p key="desktop">
      <Localized id="record-platform-not-supported-desktop">
        <span />
      </Localized>
      <a target="_blank" href="https://www.firefox.com/">
        <FontIcon type="firefox" />Firefox
      </a>{' '}
      <a target="_blank" href="https://www.google.com/chrome">
        <FontIcon type="chrome" />Chrome
      </a>
    </p>
    <p key="ios">
      <Localized id="record-platform-not-supported-ios" bold={<b />}>
        <span />
      </Localized>
    </p>
    <a target="_blank" href={getItunesURL()}>
      <img src="/img/appstore.svg" />
    </a>
  </div>
);

interface PropsFromState {
  api: API;
  locale: Locale.State;
  sentences: Recordings.Sentence[];
  user: User.State;
}

interface PropsFromDispatch {
  addUploads: typeof Uploads.actions.add;
  addNotification: typeof Notifications.actions.add;
  removeSentences: typeof Recordings.actions.removeSentences;
  tallyRecording: typeof User.actions.tallyRecording;
  updateUser: typeof User.actions.update;
}

interface Props
  extends LocalePropsFromState,
    LocalizationProps,
    PropsFromState,
    PropsFromDispatch,
    RouteComponentProps<any> {}

interface State {
  clips: (Recordings.SentenceRecording)[];
  isSubmitted: boolean;
  error?: RecordingError | AudioError;
  recordingStatus: RecordingStatus;
  rerecordIndex?: number;
  showPrivacyModal: boolean;
  showDiscardModal: boolean;
}

const initialState: State = {
  clips: [],
  isSubmitted: false,
  error: null,
  recordingStatus: null,
  rerecordIndex: null,
  showPrivacyModal: false,
  showDiscardModal: false,
};

class SpeakPage extends React.Component<Props, State> {
  state: State = initialState;

  audio: AudioWeb | AudioIOS;
  isUnsupportedPlatform = false;
  maxVolume = 0;
  recordingStartTime = 0;
  recordingStopTime = 0;

  static getDerivedStateFromProps(props: Props, state: State) {
    if (state.clips.length > 0) return null;

    if (props.sentences.length > 0) {
      return {
        clips: props.sentences
          .slice(0, SET_COUNT)
          .map(sentence => ({ recording: null, sentence })),
      };
    }

    return null;
  }

  componentDidMount() {
    this.audio = isNativeIOS() ? new AudioIOS() : new AudioWeb();
    this.audio.setVolumeCallback(this.updateVolume.bind(this));

    document.addEventListener('visibilitychange', this.releaseMicrophone);

    if (
      !this.audio.isMicrophoneSupported() ||
      !this.audio.isAudioRecordingSupported() ||
      isFirefoxFocus()
    ) {
      this.isUnsupportedPlatform = true;
    }
  }

  async componentWillUnmount() {
    document.removeEventListener('visibilitychange', this.releaseMicrophone);
    if (!this.isRecording) return;
    await this.audio.stop();
  }

  private get isRecording() {
    return this.state.recordingStatus === 'recording';
  }

  private getRecordingIndex() {
    const { rerecordIndex } = this.state;
    return rerecordIndex === null
      ? this.state.clips.findIndex(({ recording }) => !recording)
      : rerecordIndex;
  }

  private releaseMicrophone = () => {
    if (!document.hidden) {
      return;
    }

    if (this.isRecording) {
      this.saveRecording();
    }
    this.audio.release();
  };

  private processRecording = (info: AudioInfo) => {
    const error = this.getRecordingError();
    if (error) {
      return this.setState({ error });
    }

    const { clips } = this.state;
    this.setState({
      clips: clips.map(({ recording, sentence }, i) => ({
        recording: i === this.getRecordingIndex() ? info : recording,
        sentence,
      })),
      rerecordIndex: null,
    });

    trackRecording('record', this.props.locale);
  };

  private getRecordingError = (): RecordingError => {
    const length = this.recordingStopTime - this.recordingStartTime;
    if (length < MIN_RECORDING_MS) {
      return RecordingError.TOO_SHORT;
    }
    if (length > MAX_RECORDING_MS) {
      return RecordingError.TOO_LONG;
    }
    if (this.maxVolume < MIN_VOLUME) {
      return RecordingError.TOO_QUIET;
    }
    return null;
  };

  private updateVolume = (volume: number) => {
    // For some reason, volume is always exactly 100 at the end of the
    // recording, even if it is silent; so ignore that.
    if (volume !== 100 && volume > this.maxVolume) {
      this.maxVolume = volume;
    }
  };

  private rerecord = async (i: number) => {
    await this.discardRecording();

    this.setState({
      rerecordIndex: i,
    });
  };

  private handleRecordClick = async () => {
    if (this.state.recordingStatus === 'waiting') return;
    const isRecording = this.isRecording;

    this.setState({ recordingStatus: 'waiting' });

    if (isRecording) {
      this.saveRecording();
      return;
    }

    try {
      await this.audio.init();
      await this.startRecording();
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
      recordingStatus: 'recording',
      error: null,
    });
  };

  private saveRecording = () => {
    this.audio.stop().then(this.processRecording);
    this.recordingStopTime = Date.now();
    this.setState({
      recordingStatus: null,
    });
  };

  private discardRecording = async () => {
    if (!this.isRecording) return;
    await this.audio.stop();
    this.setState({ recordingStatus: null });
  };

  private cancelReRecord = async () => {
    await this.discardRecording();
    this.setState({ rerecordIndex: null });
  };

  private handleSkip = async () => {
    const { api, removeSentences, sentences } = this.props;
    const { clips } = this.state;
    await this.discardRecording();
    const { id } = clips[this.getRecordingIndex()].sentence;
    removeSentences([id]);
    this.setState({
      clips: clips.map(
        (clip, i) =>
          this.getRecordingIndex() === i
            ? { recording: null, sentence: sentences.slice(SET_COUNT)[0] }
            : clip
      ),
      error: null,
    });
    await api.skipSentence(id);
  };

  private upload = (hasAgreed: boolean = false) => {
    const {
      addNotification,
      addUploads,
      api,
      locale,
      removeSentences,
      tallyRecording,
      user,
    } = this.props;

    if (!hasAgreed && !user.privacyAgreed) {
      this.setState({ showPrivacyModal: true });
      return false;
    }

    const clips = this.state.clips.filter(clip => clip.recording);

    this.setState({ clips: [], isSubmitted: true });

    addUploads([
      ...clips.map(({ sentence, recording }) => async () => {
        let retries = 3;
        while (retries) {
          try {
            await api.uploadClip(recording.blob, sentence.id, sentence.text);
            tallyRecording();
            retries = 0;
          } catch (e) {
            console.error(e);
            retries--;
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (
              retries == 0 &&
              confirm('Upload of this clip keeps failing, keep retrying?')
            ) {
              retries = 3;
            }
          }
        }
      }),
      async () => {
        await api.syncDemographics();
        trackRecording('submit', locale);
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

    removeSentences(clips.map(c => c.sentence.id));

    return true;
  };

  private resetState = (callback?: any) =>
    this.setState(initialState, callback);

  private agreeToTerms = async () => {
    this.setState({ showPrivacyModal: false });
    this.props.updateUser({ privacyAgreed: true });
    this.upload(true);
  };

  private toggleDiscardModal = () => {
    this.setState({
      showPrivacyModal: false,
      showDiscardModal: !this.state.showDiscardModal,
    });
  };

  private resetAndGoHome = () => {
    const { history, toLocaleRoute } = this.props;
    this.resetState(() => {
      history.push(toLocaleRoute(URLS.ROOT));
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  };

  render() {
    const { getString, user } = this.props;
    const {
      clips,
      isSubmitted,
      error,
      recordingStatus,
      rerecordIndex,
      showPrivacyModal,
      showDiscardModal,
    } = this.state;
    const recordingIndex = this.getRecordingIndex();
    return (
      <React.Fragment>
        <NavigationPrompt
          when={clips.filter(clip => clip.recording).length > 0}>
          {({ onConfirm, onCancel }: any) => (
            <Modal innerClassName="record-abort" onRequestClose={onCancel}>
              <Localized id="record-abort-title">
                <h1 className="title" />
              </Localized>
              <Localized id="record-abort-text">
                <p className="text" />
              </Localized>
              <ModalButtons>
                <Localized id="record-abort-submit">
                  <Button
                    outline
                    rounded
                    onClick={() => {
                      if (this.upload()) onConfirm();
                    }}
                  />
                </Localized>
                <Localized id="record-abort-continue">
                  <Button outline rounded onClick={onCancel} />
                </Localized>
              </ModalButtons>
              <Localized id="record-abort-delete">
                <TextButton onClick={onConfirm} />
              </Localized>
            </Modal>
          )}
        </NavigationPrompt>
        {showPrivacyModal && (
          <Localized
            id="review-terms"
            termsLink={<LocaleLink to={URLS.TERMS} blank />}
            privacyLink={<LocaleLink to={URLS.PRIVACY} blank />}>
            <Modal
              buttons={{
                [getString('terms-agree')]: this.agreeToTerms,
                [getString('terms-disagree')]: this.toggleDiscardModal,
              }}
            />
          </Localized>
        )}
        {showDiscardModal && (
          <Localized id="review-aborted">
            <Modal
              buttons={{
                [getString('review-keep-recordings')]: this.toggleDiscardModal,
                [getString('review-delete-recordings')]: this.resetAndGoHome,
              }}
            />
          </Localized>
        )}
        <ContributionPage
          activeIndex={recordingIndex}
          errorContent={this.isUnsupportedPlatform && <UnsupportedInfo />}
          extraButton={
            <Localized id="unable-speak">
              <LocaleLink to={URLS.LISTEN} />
            </Localized>
          }
          instruction={props =>
            error ? (
              <div className="error">
                <Localized
                  id={
                    {
                      [RecordingError.TOO_SHORT]: 'record-error-too-short',
                      [RecordingError.TOO_LONG]: 'record-error-too-long',
                      [RecordingError.TOO_QUIET]: 'record-error-too-quiet',
                      [AudioError.NOT_ALLOWED]: 'record-must-allow-microphone',
                      [AudioError.NO_MIC]: 'record-no-mic-found',
                      [AudioError.NO_SUPPORT]: 'record-platform-not-supported',
                    }[error]
                  }
                  {...props}
                />
              </div>
            ) : (
              <Localized
                id={
                  this.isRecording
                    ? 'record-stop-instruction'
                    : recordingIndex === SET_COUNT - 1
                      ? 'record-last-instruction'
                      : ['record-instruction', 'record-again-instruction'][
                          recordingIndex
                        ] || 'record-again-instruction2'
                }
                recordIcon={<MicIcon />}
                stopIcon={<StopIcon />}
                {...props}
              />
            )
          }
          isFirstSubmit={user.recordTally === 0}
          isPlaying={this.isRecording}
          isSubmitted={isSubmitted}
          onReset={() => this.resetState()}
          onSkip={this.handleSkip}
          onSubmit={() => this.upload()}
          primaryButtons={
            <RecordButton
              status={recordingStatus}
              onClick={this.handleRecordClick}
            />
          }
          pills={clips.map((clip, i) => (props: ContributionPillProps) => (
            <RecordingPill
              {...props}
              clip={clip}
              status={
                recordingIndex === i
                  ? 'active'
                  : clip.recording ? 'done' : 'pending'
              }
              onRerecord={() => this.rerecord(i)}>
              {rerecordIndex === i && (
                <Localized id="record-cancel">
                  <TextButton onClick={this.cancelReRecord} />
                </Localized>
              )}
            </RecordingPill>
          ))}
          sentences={clips.map(({ sentence: { text } }) => text)}
          shortcuts={[
            {
              key: 'shortcut-record-toggle',
              label: 'shortcut-record-toggle-label',
              action: this.handleRecordClick,
            },
          ]}
          type="speak"
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: StateTree) => {
  return {
    api: state.api,
    locale: state.locale,
    sentences: Recordings.selectors.localeRecordings(state).sentences,
    user: state.user,
  };
};

const mapDispatchToProps = {
  addNotification: Notifications.actions.add,
  addUploads: Uploads.actions.add,
  removeSentences: Recordings.actions.removeSentences,
  tallyRecording: User.actions.tallyRecording,
  updateUser: User.actions.update,
};

export default withRouter(
  localeConnector(
    withLocalization(
      connect<PropsFromState, PropsFromDispatch>(
        mapStateToProps,
        mapDispatchToProps
      )(SpeakPage)
    )
  )
);
