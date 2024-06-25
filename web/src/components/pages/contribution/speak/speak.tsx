import {
  Localized,
  WithLocalizationProps,
  withLocalization,
} from '@fluent/react';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
const NavigationPrompt = require('react-router-navigation-prompt').default;
import { Locale } from '../../../../stores/locale';
import { Notifications } from '../../../../stores/notifications';
import { Sentences } from '../../../../stores/sentences';
import {
  AbortContributionModalActions,
  AbortContributionModalStatus,
} from '../../../../stores/abort-contribution-modal';
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
import { CheckIcon, MicIcon, StopIcon, ReturnKeyIcon } from '../../../ui/icons';
import { Button, TextButton, Spinner } from '../../../ui/ui';
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
import SpeakErrorContent from './speak-error-content';
import { USER_LANGUAGES } from './firstSubmissionCTA/firstPostSubmissionCTA';
import { castTrueString } from '../../../../utility';
import { trackGtag } from '../../../../services/tracker-ga';

import './speak.css';

const MIN_RECORDING_MS = 1000;
const MIN_RECORDING_MS_BENCHMARK = 500;
const MAX_RECORDING_MS = 15000;
const MIN_VOLUME = 8; // Range: [0, 255].

enum RecordingError {
  TOO_SHORT = 'TOO_SHORT',
  TOO_LONG = 'TOO_LONG',
  TOO_QUIET = 'TOO_QUIET',
}

interface PropsFromState {
  api: API;
  locale: Locale.State;
  sentences: SentenceType[];
  user: User.State;
  isLoading: boolean;
  hasLoadingError: boolean;
}

interface PropsFromDispatch {
  addUploads: typeof Uploads.actions.add;
  addAchievement: typeof Notifications.actions.addAchievement;
  addNotification: typeof Notifications.actions.addPill;
  loadSentences: typeof Sentences.actions.refill;
  removeSentences: typeof Sentences.actions.remove;
  tallyRecording: typeof User.actions.tallyRecording;
  refreshUser: typeof User.actions.refresh;
  updateUser: typeof User.actions.update;
  setAbortContributionModalVisible: typeof AbortContributionModalActions.setAbortContributionModalVisible;
  setAbortStatus: typeof AbortContributionModalActions.setAbortStatus;
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
  privacyAgreedChecked?: boolean;
  shouldShowFirstCTA: boolean;
  shouldShowSecondCTA: boolean;
}

const initialState: State = {
  clips: [],
  isSubmitted: false,
  error: null,
  recordingStatus: null,
  rerecordIndex: null,
  showPrivacyModal: false,
  showDiscardModal: false,
  shouldShowFirstCTA: false,
  shouldShowSecondCTA: false,
};

const SEEN_FIRST_CTA = 'seenFirstCTA';
const SEEN_SECOND_CTA = 'seenSecondCTA';

class SpeakPage extends React.Component<Props, State> {
  state: State = {
    ...initialState,
    privacyAgreedChecked: Boolean(
      this.props.user.privacyAgreed || this.props.user.account
    ),
  };

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
    const { loadSentences } = this.props;
    loadSentences();

    if (localStorage.getItem(USER_LANGUAGES)) {
      localStorage.removeItem(USER_LANGUAGES);
    }

    this.audio = new AudioWeb();
    this.audio.setVolumeCallback(this.updateVolume.bind(this));

    document.addEventListener('visibilitychange', this.releaseMicrophone);
    document.addEventListener('keyup', this.handleKeyUp);

    if (
      !this.audio.isMicrophoneSupported() ||
      !this.audio.isAudioRecordingSupported()
    ) {
      this.isUnsupportedPlatform = true;
    }
  }

  async componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyUp);

    document.removeEventListener('visibilitychange', this.releaseMicrophone);
    if (!this.isRecording) return;
    await this.audio.stop();
  }

  private get isRecording() {
    return this.state.recordingStatus === 'recording';
  }

  /**
   * Shortcuts which need more complex matching than a single "key comparison"
   * are handled here.
   * If possible use the `shortcuts` prop of `ContributionPage` instead.
   */
  private handleKeyUp = async (event: KeyboardEvent) => {
    let reRecordIndex = null;
    //for both sets of number keys on a keyboard with shift key
    if (event.code === 'Digit1' || event.code === 'Numpad1') {
      reRecordIndex = 0;
    } else if (event.code === 'Digit2' || event.code === 'Numpad2') {
      reRecordIndex = 1;
    } else if (event.code === 'Digit3' || event.code === 'Numpad3') {
      reRecordIndex = 2;
    } else if (event.code === 'Digit4' || event.code === 'Numpad4') {
      reRecordIndex = 3;
    } else if (event.code === 'Digit5' || event.code === 'Numpad5') {
      reRecordIndex = 4;
    } else if (event.key === 'Esc' || event.key === 'Escape') {
      if (this.isRecording) {
        trackRecording('discard-ongoing', this.props.locale);
        await this.discardRecording();
      }
    }

    if (reRecordIndex !== null) {
      trackRecording('rerecord', this.props.locale);
      await this.discardRecording();
      this.setState({
        rerecordIndex: reRecordIndex,
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
    trackGtag('listen_click', { record_index: this.getRecordingIndex() });

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
    api.skipSentence(id);
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

  private upload = (hasAgreed = false) => {
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
      getString,
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
            let key = 'error-clip-upload';

            if (error.message.includes('save_clip_error')) {
              key = 'error-clip-upload-server';
            }

            retries--;
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (retries == 0 && confirm(getString(key))) {
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
    this.setState({ privacyAgreedChecked: true });
    this.props.updateUser({ privacyAgreed: true });
    this.upload(true);
  };

  private onPrivacyAgreedChange = (privacyAgreed: boolean) => {
    this.setState({ privacyAgreedChecked: privacyAgreed });
  };

  private toggleDiscardModal = () => {
    this.setState({
      showPrivacyModal: false,
      showDiscardModal: !this.state.showDiscardModal,
    });
  };

  private handleSubmit = (evt: React.SyntheticEvent) => {
    const { user } = this.props;

    const hasSeenFirstCTA = castTrueString(
      window.sessionStorage.getItem(SEEN_FIRST_CTA)
    );

    const hasSeenSecondCTA = castTrueString(
      window.sessionStorage.getItem(SEEN_SECOND_CTA)
    );

    this.props.updateUser({ privacyAgreed: this.state.privacyAgreedChecked });

    evt.preventDefault();
    this.upload(this.state.privacyAgreedChecked);

    if (!user.account) {
      if (!hasSeenFirstCTA) {
        // display first CTA screen if it has not been seen it before
        // and the user does not have an account
        this.setState({ shouldShowFirstCTA: true });
        window.sessionStorage.setItem(SEEN_FIRST_CTA, 'true');
      } else if (hasSeenFirstCTA && !hasSeenSecondCTA) {
        // display second CTA screen if it has not been seen it before and the first CTA has been seen
        // and the user does not have an account
        this.setState({ shouldShowSecondCTA: true });
        window.sessionStorage.setItem(SEEN_SECOND_CTA, 'true');
      } else if (hasSeenFirstCTA && hasSeenSecondCTA) {
        // Reset for unauthenticated users who have seen the first and
        // second CTA so they can see new sentences to record
        this.resetState();
      }
    }
  };

  private resetAndGoHome = () => {
    const { history, toLocaleRoute } = this.props;
    this.resetState(() => {
      history.push(toLocaleRoute(URLS.ROOT));
      window.scrollTo({ top: 0 });
    });
  };

  private setAbortContributionModalVisiblity = (
    abortContributionModalVisibilty: boolean
  ) => {
    const { setAbortContributionModalVisible } = this.props;
    setAbortContributionModalVisible(abortContributionModalVisibilty);
  };

  private handleAbortCancel = (onCancel: () => void) => {
    onCancel();
    this.props.setAbortStatus(AbortContributionModalStatus.REJECTED);
    this.setAbortContributionModalVisiblity(false);
  };

  private handleAbortConfirm = (onConfirm: () => void) => {
    onConfirm();
    this.props.setAbortStatus(AbortContributionModalStatus.CONFIRMED);
    this.setAbortContributionModalVisiblity(false);
  };

  render() {
    const { getString, user, isLoading, hasLoadingError, locale } = this.props;
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

    const noClips = clips.length === 0;
    const noNewClips = noClips || !clips.some(clip => clip.recording === null);
    const isMissingClips = !isLoading && noClips;
    const currentLanguage = user?.account?.languages.find(
      language => language.locale === locale
    );
    const isVariantPreferredOption =
      currentLanguage?.variant?.is_preferred_option;

    return (
      <>
        <div id="speak-page">
          {noNewClips && isLoading && <Spinner delayMs={500} />}
          {!isSubmitted && (
            <NavigationPrompt
              when={() => {
                const clipsToRecord =
                  clips.filter(clip => clip.recording).length > 0;

                if (clipsToRecord) {
                  this.setAbortContributionModalVisiblity(true);
                }

                return clipsToRecord;
              }}>
              {({ onConfirm, onCancel }: any) => (
                <Modal
                  innerClassName="record-abort"
                  onRequestClose={() => this.handleAbortCancel(onCancel)}>
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
                          if (this.upload()) this.handleAbortConfirm(onConfirm);
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
                        onClick={() => this.handleAbortCancel(onCancel)}
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
              onAgree={() => this.agreeToTerms()}
              onDisagree={this.toggleDiscardModal}
            />
          )}
          {showDiscardModal && (
            <Localized id="review-aborted">
              <Modal
                buttons={{
                  [getString('review-keep-recordings')]:
                    this.toggleDiscardModal,
                  [getString('review-delete-recordings')]: this.resetAndGoHome,
                }}
              />
            </Localized>
          )}
          <ContributionPage
            demoMode={this.demoMode}
            activeIndex={recordingIndex}
            hasErrors={
              this.isUnsupportedPlatform ||
              (!isLoading && (hasLoadingError || isMissingClips))
            }
            errorContent={
              <SpeakErrorContent
                isLoading={isLoading}
                hasLoadingError={hasLoadingError}
                isUnsupportedPlatform={this.isUnsupportedPlatform}
                isMissingClips={isMissingClips}
                isMissingClipsForVariant={
                  isMissingClips && isVariantPreferredOption
                }
              />
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
                <>
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
                </>
              )
            }
            isFirstSubmit={user.recordTally === 0}
            isPlaying={this.isRecording}
            isSubmitted={isSubmitted}
            onReset={() => this.resetState()}
            onSkip={this.handleSkip}
            onSubmit={this.handleSubmit}
            onPrivacyAgreedChange={(privacyAgreed: boolean) =>
              this.onPrivacyAgreedChange(privacyAgreed)
            }
            privacyAgreedChecked={this.state.privacyAgreedChecked}
            shouldShowFirstCTA={this.state.shouldShowFirstCTA}
            shouldShowSecondCTA={this.state.shouldShowSecondCTA}
            primaryButtons={
              <RecordButton
                trackClass="speak-record"
                status={recordingStatus}
                onClick={this.handleRecordClick}
                data-testid="record-button"
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
                    <TextButton
                      onClick={this.cancelReRecord}
                      className="text"
                    />
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
                key: 'shortcut-discard-ongoing-recording',
                label: 'shortcut-discard-ongoing-recording-label',
                // This is handled in handleKeyUp, separately.
                action: () => {},
              },
              {
                key: 'shortcut-submit',
                label: 'shortcut-submit-label',
                icon: <ReturnKeyIcon />,
                // This is handled in handleKeyUp, separately.
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
  const { sentences, isLoading, hasLoadingError } =
    Sentences.selectors.localeSentences(state);

  return {
    api: state.api,
    locale: state.locale,
    sentences,
    user: state.user,
    isLoading,
    hasLoadingError,
  };
};

const mapDispatchToProps = {
  addNotification: Notifications.actions.addPill,
  addAchievement: Notifications.actions.addAchievement,
  addUploads: Uploads.actions.add,
  loadSentences: Sentences.actions.refill,
  removeSentences: Sentences.actions.remove,
  tallyRecording: User.actions.tallyRecording,
  refreshUser: User.actions.refresh,
  updateUser: User.actions.update,
  setAbortContributionModalVisible:
    AbortContributionModalActions.setAbortContributionModalVisible,
  setAbortStatus: AbortContributionModalActions.setAbortStatus,
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
