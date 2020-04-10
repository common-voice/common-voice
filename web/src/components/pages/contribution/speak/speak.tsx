import {
  LocalizationProps,
  Localized,
  withLocalization,
} from 'fluent-react/compat';
import * as React from 'react';
import BalanceText from 'react-balance-text';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
const NavigationPrompt = require('react-router-navigation-prompt').default;
import { Locale } from '../../../../stores/locale';
import { Notifications } from '../../../../stores/notifications';
import { Sentences } from '../../../../stores/sentences';
import StateTree from '../../../../stores/tree';
import { Uploads } from '../../../../stores/uploads';
import { User } from '../../../../stores/user';
import API from '../../../../services/api';
import { trackRecording, getTrackClass } from '../../../../services/tracker';
import URLS from '../../../../urls';
import {
  localeConnector,
  LocaleLink,
  LocalePropsFromState,
} from '../../../locale-helpers';
import Modal, { ModalButtons } from '../../../modal/modal';
import TermsModal from '../../../terms-modal';
import {
  CheckIcon,
  FontIcon,
  MicIcon,
  StopIcon,
  ArrowRight,
  FirefoxColor,
  ChromeColor,
  SafariColor,
} from '../../../ui/icons';
import { Button, TextButton, LinkButton } from '../../../ui/ui';
import {
  isFirefoxFocus,
  isNativeIOS,
  isIOS,
  isMobileWebkit,
} from '../../../../utility';
import ContributionPage, {
  ContributionPillProps,
  SET_COUNT,
} from '../contribution';
import {
  RecordButton,
  RecordingStatus,
} from '../../../primary-buttons/primary-buttons';
import AudioIOS from './audio-ios';
import AudioWeb, { AudioError, AudioInfo } from './audio-web';
import RecordingPill from './recording-pill';
import { SentenceRecording } from './sentence-recording';

import './speak.css';

const MIN_RECORDING_MS = 1000;
const MAX_RECORDING_MS = 10000;
const MIN_VOLUME = 1;

enum RecordingError {
  TOO_SHORT = 'TOO_SHORT',
  TOO_LONG = 'TOO_LONG',
  TOO_QUIET = 'TOO_QUIET',
}

const UnsupportedInfo = () => (
  <div className="empty-container">
    <div className="error-card card-dimensions unsupported">
      {isIOS() && !isMobileWebkit() ? (
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
  sentences: Sentences.Sentence[];
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
    LocalizationProps,
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

  audio: AudioWeb | AudioIOS;
  isUnsupportedPlatform = false;
  maxVolume = 0;
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
            : { recording: null, sentence: unusedSentences.pop() || null }
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
    this.audio = isNativeIOS() ? new AudioIOS() : new AudioWeb();
    this.audio.setVolumeCallback(this.updateVolume.bind(this));

    document.addEventListener('visibilitychange', this.releaseMicrophone);
    document.addEventListener('keyup', this.handleKeyUprerecording);

    if (
      !this.audio.isMicrophoneSupported() ||
      !this.audio.isAudioRecordingSupported() ||
      isFirefoxFocus()
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
      this.maxVolume = 0;
      this.recordingStartTime = Date.now();
      this.recordingStopTime = 0;
      this.setState({
        // showSubmitSuccess: false,
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
    const { api, removeSentences, sentences } = this.props;
    const { clips } = this.state;
    await this.discardRecording();
    const current = this.getRecordingIndex();
    const { id } = clips[current]?.sentence || {};
    removeSentences([id]);
    this.setState({
      clips: clips.map((clip, i) =>
        current === i ? { recording: null, sentence: null } : clip
      ),
      error: null,
    });
    await api.skipSentence(id);
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
              sentence.text
            );
            sessionStorage.setItem(
              'challengeEnded',
              JSON.stringify(challengeEnded)
            );
            sessionStorage.setItem('hasContributed', 'true');
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
          <React.Fragment>
            <CheckIcon />{' '}
            <Localized id="clips-uploaded">
              <span />
            </Localized>
          </React.Fragment>
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
                    className={getTrackClass('fs', 'exit-continue-recording')}
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
                [getString('review-keep-recordings')]: this.toggleDiscardModal,
                [getString('review-delete-recordings')]: this.resetAndGoHome,
              }}
            />
          </Localized>
        )}
        <ContributionPage
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
                  <TextButton onClick={this.cancelReRecord} />
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
          sentences={clips.map(({ sentence }) => sentence && sentence.text)}
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
          ]}
          type="speak"
        />
      </React.Fragment>
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
