import {
  Localized,
  WithLocalizationProps,
  withLocalization,
} from '@fluent/react';
import * as React from 'react';
import BalanceText from 'react-balance-text';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
const NavigationPrompt = require('react-router-navigation-prompt').default;
import { Locale } from '../../../../stores/locale';
import { Notifications } from '../../../../stores/notifications';
import { Sentences } from '../../../../stores/sentences';
import { Sentence as SentenceType } from 'common';
import StateTree from '../../../../stores/tree';
import { Uploads } from '../../../../stores/uploads';
import { User } from '../../../../stores/user';
import API from '../../../../services/api';
import { trackRecording, getTrackClass } from '../../../../services/tracker';
import URLS from '../../../../urls';
import { localeConnector, LocalePropsFromState } from '../../../locale-helpers';
import Modal, { ModalButtons } from '../../../modal/modal';
import TermsModal from '../../../terms-modal';
import {
  CheckIcon,
  MicIcon,
  StopIcon,
  ArrowRight,
  FirefoxColor,
  ChromeColor,
  SafariColor,
  ReturnKeyIcon,
} from '../../../ui/icons';
import { Button, TextButton, LinkButton } from '../../../ui/ui';
import { isIOS, isMobileSafari } from '../../../../utility';
import ContributionPage, {
  ContributionPillProps,
  SET_COUNT,
} from '../contribution';
import {
  RecordButton,
  RecordingStatus,
} from '../../../primary-buttons/primary-buttons';
import AudioWeb, { AudioError, AudioInfo } from './audio-web';
import RecordingPill from './recording-pill';
import { SentenceRecording } from './sentence-recording';

import './speak.css';

const MIN_RECORDING_MS = 1000;
const MIN_RECORDING_MS_BENCHMARK = 500;
const MAX_RECORDING_MS = 10000;
const MIN_VOLUME = 8; // Range: [0, 255].

enum RecordingError {
  TOO_SHORT = 'TOO_SHORT',
  TOO_LONG = 'TOO_LONG',
  TOO_QUIET = 'TOO_QUIET',
}

const UnsupportedInfo = () => (
  <div className="empty-container">
    <div className="error-card card-dimensions unsupported">
      {isIOS() && !isMobileSafari() ? (
        <>
          <BalanceText>
            <Localized id="record-platform-not-supported-ios-non-safari" />
          </BalanceText>
          <SafariColor />
        </>
      ) : (
        <>
          <BalanceText>
            <Localized id="record-platform-not-supported" />
          </BalanceText>
          <p className="desktop">
            <Localized id="record-platform-not-supported-desktop">
              <BalanceText />
            </Localized>
          </p>
          <div>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.firefox.com/"
              title="Firefox">
              <FirefoxColor />
            </a>{' '}
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.google.com/chrome"
              title="Chrome">
              <ChromeColor />
            </a>
          </div>
        </>
      )}
    </div>
  </div>
);

const NoSentencesAvailable = () => (
  <div className="empty-container">
    <div className="error-card card-dimensions no-sentences-available">
      <Localized id="speak-empty-state">
        <span />
      </Localized>
      <LinkButton
        rounded
        blank
        href="https://common-voice.github.io/sentence-collector/">
        <ArrowRight className="speak-sc-icon" />{' '}
        <Localized id="speak-empty-state-cta">
          <span />
        </Localized>
      </LinkButton>
    </div>
  </div>
);

interface PropsFromState {
  api: API;
  locale: Locale.State;
  sentences: SentenceType[];
  user: User.State;
  isLoading: boolean;
}

interface PropsFromDispatch {
  addUploads: typeof Uploads.actions.add;
  addAchievement: typeof Notifications.actions.addAchievement;
  addNotification: typeof Notifications.actions.addPill;
  removeSentences: typeof Sentences.actions.remove;
  tallyRecording: typeof User.actions.tallyRecording;
  refreshUser: typeof User.actions.refresh;
  updateUser: typeof User.actions.update;
}

interface Props
  extends LocalePropsFromState,
    WithLocalizationProps,
    PropsFromState,
    PropsFromDispatch,
    RouteComponentProps<any, any, any> {}

interface State {
  clips: SentenceRecording[];
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
  demoMode = this.props.location.pathname.includes(URLS.DEMO);

  audio: AudioWeb;
  isUnsupportedPlatform = false;
  maxVolume = -1;
  recordingStartTime = 0;
  recordingStopTime = 0;

  static getDerivedStateFromProps(props: Props, state: State) {
    if (state.clips.length > 0) {
      const sentenceIds = state.clips
        .map(({ sentence }) => (sentence ? sentence.id : null))
        .filter(Boolean);
      const unusedSentences = props.sentences.filter(
        s => !sentenceIds.includes(s.id)
      );
      return {
        clips: state.clips.map(clip =>
          clip.sentence
            ? clip
            : { recording: null, sentence: unusedSentences.shift() || null }
        ),
      };
    }

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
    this.audio = new AudioWeb();
    this.audio.setVolumeCallback(this.updateVolume.bind(this));

    document.addEventListener('visibilitychange', this.releaseMicrophone);
    document.addEventListener('keyup', this.handleKeyUprerecording);

    if (
      !this.audio.isMicrophoneSupported() ||
      !this.audio.isAudioRecordingSupported()
    ) {
      this.isUnsupportedPlatform = true;
    }
  }

  async componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyUprerecording);

    document.removeEventListener('visibilitychange', this.releaseMicrophone);
    if (!this.isRecording) return;
    await this.audio.stop();
  }

  private get isRecording() {
    return this.state.recordingStatus === 'recording';
  }

  private handleKeyUprerecording = async (event: any) => {
    let index = null;
    //for both sets of number keys on a keyboard with shift key
    if (event.code === 'Digit1' || event.code === 'Numpad1') {
      index = 0;
    } else if (event.code === 'Digit2' || event.code === 'Numpad2') {
      index = 1;
    } else if (event.code === 'Digit3' || event.code === 'Numpad3') {
      index = 2;
    } else if (event.code === 'Digit4' || event.code === 'Numpad4') {
      index = 3;
    } else if (event.code === 'Digit5' || event.code === 'Numpad5') {
      index = 4;
    }

    if (index !== null) {
      trackRecording('rerecord', this.props.locale);
      await this.discardRecording();
      this.setState({
        rerecordIndex: index,
      });
    }
  };

  private getRecordingIndex() {
    return (
      this.state.rerecordIndex ??
      this.state.clips.findIndex(({ recording }) => !recording)
    );
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

    this.setState(({ clips }) => {
      const newClips = [...clips];
      newClips[this.getRecordingIndex()].recording = info;
      return {
        clips: newClips,
        rerecordIndex: null,
      };
    });

    trackRecording('record', this.props.locale);
  };

  private getRecordingError = (): RecordingError => {
    const length = this.recordingStopTime - this.recordingStartTime;
    const currentSentence = this.state.clips[this.getRecordingIndex()].sentence;
    const minClipLength = currentSentence.taxonomy
      ? MIN_RECORDING_MS_BENCHMARK
      : MIN_RECORDING_MS;

    if (length < minClipLength) {
      return RecordingError.TOO_SHORT;
    }
    if (length > MAX_RECORDING_MS) {
      return RecordingError.TOO_LONG;
    }
    // If updateVolume was never called, we assume there’s a problem with the
    // AnalyserNode and skip this error.
    if (this.maxVolume !== -1 && this.maxVolume < MIN_VOLUME) {
      return RecordingError.TOO_QUIET;
    }
    return null;
  };

  private updateVolume = (volume: number) => {
    if (volume > this.maxVolume) {
      this.maxVolume = volume;
    }
  };

  private rerecord = async (i: number) => {
    trackRecording('rerecord', this.props.locale);
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
    try {
      await this.audio.start();
      this.maxVolume = -1; // Initialize to -1 in case updateVolume is never called.
      this.recordingStartTime = Date.now();
      this.recordingStopTime = 0;
      this.setState({
        recordingStatus: 'recording',
        error: null,
      });
    } catch (err) {
      this.setState({
        recordingStatus: null,
      });
    }
  };

  private saveRecording = () => {
    // We noticed that some people hit the Stop button too early, cutting off
    // the recording prematurely. To compensate, we add a short buffer to the
    // end of each recording (issue #1648).
    const RECORD_STOP_DELAY = 500;
    setTimeout(async () => {
      const info = await this.audio.stop();
      this.processRecording(info);
    }, RECORD_STOP_DELAY);
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
    const { api, removeSentences } = this.props;
    await this.discardRecording();
    const current = this.getRecordingIndex();
    const id = this.state.clips[current]?.sentence?.id;
    removeSentences([id]);
    this.setState(({ clips }) => {
      const newClips = [...clips];
      newClips[current] = { recording: null, sentence: null };
      if (clips[current]?.recording?.url)
        URL.revokeObjectURL(clips[current].recording.url);
      return {
        clips: newClips,
        error: null,
      };
    });
  };

  private upload = (hasAgreed: boolean = false) => {
    const {
      addAchievement,
      addNotification,
      addUploads,
      api,
      locale,
      removeSentences,
      tallyRecording,
      user,
      refreshUser,
    } = this.props;

    if (!hasAgreed && !(user.privacyAgreed || user.account)) {
      this.setState({ showPrivacyModal: true });
      return false;
    }

    const clips = this.state.clips.filter(clip => clip.recording);

    removeSentences(clips.map(c => c.sentence.id));

    this.setState({ clips: [], isSubmitted: true });

    addUploads([
      ...clips.map(({ sentence, recording }) => async () => {
        let retries = 3;
        while (retries) {
          try {
            const {
              showFirstContributionToast = false,
              hasEarnedSessionToast = false,
              showFirstStreakToast = false,
              challengeEnded = true,
            } = await api.uploadClip(
              recording.blob,
              sentence.id,
              this.demoMode
            );
            URL.revokeObjectURL(recording.url);
            try {
              sessionStorage.setItem(
                'challengeEnded',
                JSON.stringify(challengeEnded)
              );
              sessionStorage.setItem('hasContributed', 'true');
            } catch (e) {
              console.warn(`A sessionStorage error occurred ${e.message}`);
            }

            if (showFirstContributionToast) {
              addAchievement(
                50,
                "You're on your way! Congrats on your first contribution.",
                'success'
              );
            }
            if (showFirstStreakToast) {
              addAchievement(
                50,
                'You completed a three-day streak! Keep it up.',
                'success'
              );
            }
            if (
              !JSON.parse(sessionStorage.getItem('challengeEnded')) &&
              JSON.parse(sessionStorage.getItem('hasShared')) &&
              !hasEarnedSessionToast
            ) {
              addAchievement(
                50,
                "You're on a roll! You sent an invite and contributed in the same session.",
                'success'
              );
              sessionStorage.removeItem('hasShared');
              // Tell back-end user get unexpected achievement: invite + contribute in the same session
              // Each user can only get once.
              api.setInviteContributeAchievement();
            }
            if (!user.account) {
              tallyRecording();
            }
            retries = 0;
          } catch (error) {
            let msg;
            if (error.message === 'save_clip_error') {
              msg =
                'Upload of this clip keeps failing at server, reload the page or try after sometime';
            } else {
              msg = 'Upload of this clip keeps failing, keep retrying?';
            }
            retries--;
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (retries == 0 && confirm(msg)) {
              retries = 3;
            }
          }
        }
      }),
      async () => {
        trackRecording('submit', locale);
        refreshUser();
        addNotification(
          <>
            <CheckIcon />{' '}
            <Localized id="clips-uploaded">
              <span />
            </Localized>
          </>
        );
      },
    ]);

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

  private displayError = () => {
    return (
      this.isUnsupportedPlatform ||
      (!this.props.isLoading && this.state.clips.length == 0)
    );
  };

  private returnSpeakError = () => {
    return this.isUnsupportedPlatform ? (
      <UnsupportedInfo />
    ) : (
      <NoSentencesAvailable />
    );
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
      <>
        <div id="speak-page">
          {!isSubmitted && (
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
                        className={getTrackClass('fs', 'exit-submit-clips')}
                        onClick={() => {
                          if (this.upload()) onConfirm();
                        }}
                      />
                    </Localized>
                    <Localized id="record-abort-continue">
                      <Button
                        outline
                        rounded
                        className={getTrackClass(
                          'fs',
                          'exit-continue-recording'
                        )}
                        onClick={onCancel}
                      />
                    </Localized>
                  </ModalButtons>
                  <Localized id="record-abort-delete">
                    <TextButton
                      className={getTrackClass('fs', 'exit-delete-clips')}
                      onClick={onConfirm}
                    />
                  </Localized>
                </Modal>
              )}
            </NavigationPrompt>
          )}
          {showPrivacyModal && (
            <TermsModal
              onAgree={this.agreeToTerms}
              onDisagree={this.toggleDiscardModal}
            />
          )}
          {showDiscardModal && (
            <Localized id="review-aborted">
              <Modal
                buttons={{
                  [getString('review-keep-recordings')]: this
                    .toggleDiscardModal,
                  [getString('review-delete-recordings')]: this.resetAndGoHome,
                }}
              />
            </Localized>
          )}
          <ContributionPage
            demoMode={this.demoMode}
            activeIndex={recordingIndex}
            errorContent={this.displayError() && this.returnSpeakError()}
            instruction={props =>
              error ? (
                <div className="error">
                  <Localized
                    id={
                      {
                        [RecordingError.TOO_SHORT]: 'record-error-too-short',
                        [RecordingError.TOO_LONG]: 'record-error-too-long',
                        [RecordingError.TOO_QUIET]: 'record-error-too-quiet',
                        [AudioError.NOT_ALLOWED]:
                          'record-must-allow-microphone',
                        [AudioError.NO_MIC]: 'record-no-mic-found',
                        [AudioError.NO_SUPPORT]:
                          'record-platform-not-supported',
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
                  elems={{
                    recordIcon: <MicIcon />,
                    stopIcon: <StopIcon />,
                  }}
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
                trackClass="speak-record"
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
                    : clip.recording
                    ? 'done'
                    : 'pending'
                }
                onRerecord={() => this.rerecord(i)}>
                {rerecordIndex === i && (
                  <Localized id="record-cancel">
                    <TextButton onClick={this.cancelReRecord} className="text"/>
                  </Localized>
                )}
              </RecordingPill>
            ))}
            reportModalProps={{
              reasons: [
                'offensive-language',
                'grammar-or-spelling',
                'different-language',
                'difficult-pronounce',
              ],
              kind: 'sentence',
              id:
                recordingIndex == -1 || !clips[recordingIndex].sentence
                  ? null
                  : clips[recordingIndex].sentence.id,
            }}
            sentences={clips.map(({ sentence }) => sentence)}
            shortcuts={[
              {
                key: 'shortcut-record-toggle',
                label: 'shortcut-record-toggle-label',
                action: this.handleRecordClick,
              },
              {
                key: 'shortcut-rerecord-toggle',
                label: 'shortcut-rerecord-toggle-label',
                action: this.handleRecordClick,
              },
              {
                key: 'shortcut-submit',
                label: 'shortcut-submit-label',
                icon: <ReturnKeyIcon />,
                // This is handled in handleKeyDown, separately.
                action: () => {},
              },
            ]}
            type="speak"
          />
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: StateTree) => {
  const { sentences, isLoading } = Sentences.selectors.localeSentences(state);

  return {
    api: state.api,
    locale: state.locale,
    sentences,
    user: state.user,
    isLoading,
  };
};

const mapDispatchToProps = {
  addNotification: Notifications.actions.addPill,
  addAchievement: Notifications.actions.addAchievement,
  addUploads: Uploads.actions.add,
  removeSentences: Sentences.actions.remove,
  tallyRecording: User.actions.tallyRecording,
  refreshUser: User.actions.refresh,
  updateUser: User.actions.update,
};

export default withRouter(
  localeConnector(
    withLocalization(
      connect<PropsFromState, any>(
        mapStateToProps,
        mapDispatchToProps
      )(SpeakPage)
    )
  )
);
