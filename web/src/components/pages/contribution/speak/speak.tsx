import {
  LocalizationProps,
  Localized,
  withLocalization,
} from 'fluent-react/compat';
import * as React from 'react';
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
import { trackRecording } from '../../../../services/tracker';
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
  DownIcon,
} from '../../../ui/icons';
import {
  Button,
  TextButton,
  LabeledSelect,
  LabeledCheckbox,
} from '../../../ui/ui';
import { getItunesURL, isFirefoxFocus, isNativeIOS } from '../../../../utility';
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
import { LANGUAGES, AGES, SEXES } from '../../../../stores/demographics';

import './speak.css';

const MIN_RECORDING_MS = 1000;
const MAX_RECORDING_MS = 10000;
const MIN_VOLUME = 1;

const DEFAULT_LANGUAGE = 'islenska';

enum RecordingError {
  TOO_SHORT = 'TOO_SHORT',
  TOO_LONG = 'TOO_LONG',
  TOO_QUIET = 'TOO_QUIET',
}

enum DemographicError {
  NO_SEX = 'NO_SEX',
  NO_AGE = 'NO_AGE',
  NO_NATIVE_LANGUAGE = 'NO_NATIVE_LANGUAGE',
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
        <FontIcon type="firefox" />
        Firefox
      </a>{' '}
      <a target="_blank" href="https://www.google.com/chrome">
        <FontIcon type="chrome" />
        Chrome
      </a>
    </p>
    <p key="ios">
      <Localized id="record-platform-not-supported-ios" bold={<b />}>
        <span />
      </Localized>
    </p>
    <a target="_blank" href={getItunesURL()}>
      <img src={require('./appstore.svg')} />
    </a>
  </div>
);

interface PropsFromState {
  api: API;
  locale: Locale.State;
  sentences: Sentences.Sentence[];
  user: User.State;
}

interface PropsFromDispatch {
  addUploads: typeof Uploads.actions.add;
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
    RouteComponentProps<any> {}

interface State {
  clips: SentenceRecording[];
  isSubmitted: boolean;
  error?: RecordingError | AudioError;
  demographicError?: DemographicError;
  recordingStatus: RecordingStatus;
  rerecordIndex?: number;
  showPrivacyModal: boolean;
  showDiscardModal: boolean;
  showDemographicInfo: boolean;
  showDemographicModal: boolean;
  showLanguageSelect: boolean;
  demographic: {
    sex: string;
    age: string;
    native_language: string;
  };
}

const initialState: State = {
  clips: [],
  isSubmitted: false,
  error: null,
  demographicError: null,
  recordingStatus: null,
  rerecordIndex: null,
  showPrivacyModal: false,
  showDiscardModal: false,
  showDemographicInfo: true,
  showDemographicModal: true,
  showLanguageSelect: false,
  demographic: {
    sex: '',
    age: '',
    native_language: DEFAULT_LANGUAGE,
  },
};

const Options = withLocalization(
  ({
    children,
    getString,
  }: {
    children: { [key: string]: string };
  } & LocalizationProps) => (
    <React.Fragment>
      {Object.entries(children).map(([key, value]) => (
        <option key={key} value={key}>
          {getString(key, null, value)}
        </option>
      ))}
    </React.Fragment>
  )
);

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
    const { id } = clips[current].sentence;
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

    const { demographic } = this.state;

    const demographicError = this.getDemographicError();
    if (demographicError) {
      this.setState({
        demographicError,
        showDemographicModal: true,
      });
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
            await api.uploadClip(
              recording.blob,
              sentence.id,
              sentence.text,
              demographic
            );
            if (!user.account) {
              tallyRecording();
            }
            retries = 0;
          } catch (error) {
            let msg;
            if (error.message === 'save_clip_error') {
              msg =
                'Innsending raddsýnis mistekst sífellt á netþjóni, prófaðu að endurhlaða síðunni eða reyndu aftur eftir smá stund';
            } else {
              msg = 'Innsending raddsýnis mistekst sífellt, reyna áfram?';
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

  private submitDemographic = () => {
    const demographicError = this.getDemographicError();
    if (demographicError) {
      return this.setState({
        demographicError,
      });
    } else {
      this.setState({
        showDemographicModal: false,
        demographicError,
      });
      //TODO: save info to cookies/store/...
    }
  };

  private getDemographicError = (): DemographicError => {
    const { demographic } = this.state;

    if (demographic.age == '' || !(demographic.age in AGES)) {
      return DemographicError.NO_AGE;
    }
    if (
      demographic.native_language == '' ||
      !(demographic.native_language in LANGUAGES)
    ) {
      return DemographicError.NO_NATIVE_LANGUAGE;
    }
    if (demographic.sex == '' || !(demographic.sex in SEXES)) {
      return DemographicError.NO_SEX;
    }
    return null;
  };

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

  private handleChangeFor = (e: any) => {
    this.setState({
      demographic: {
        ...this.state.demographic,
        [e.target.name]: e.target.value,
      },
    });
  };

  private toggleNativeIcelandic = () => {
    this.setState({
      showLanguageSelect: !this.state.showLanguageSelect,
    });
    if (!this.state.showLanguageSelect) {
      this.setState({
        demographic: {
          ...this.state.demographic,
          native_language: DEFAULT_LANGUAGE,
        },
      });
    }
  };

  private setShowDemographicInfo() {
    this.setState({
      showDemographicInfo: !this.state.showDemographicInfo,
    });
  }

  render() {
    const { getString, user } = this.props;
    const {
      clips,
      isSubmitted,
      error,
      demographicError,
      recordingStatus,
      rerecordIndex,
      showPrivacyModal,
      showDiscardModal,
      showDemographicModal,
      demographic,
      showLanguageSelect,
    } = this.state;
    const recordingIndex = this.getRecordingIndex();
    console.log(this.state.demographic);
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
        {showDemographicModal && (
          <Modal
            innerClassName="demographic-modal"
            onRequestClose={this.resetAndGoHome}>
            <Localized id="demographic-form-title" className="form-title">
              <h1 className="title" />
            </Localized>

            {demographicError && (
              <div className="modal-error">
                <Localized
                  id={
                    {
                      [DemographicError.NO_AGE]: 'no-age',
                      [DemographicError.NO_NATIVE_LANGUAGE]:
                        'no-native-language',
                      [DemographicError.NO_SEX]: 'no-sex',
                    }[demographicError]
                  }
                />
              </div>
            )}

            <div className="form-fields">
              <Localized id="demographic-form-age" attrs={{ label: true }}>
                <LabeledSelect
                  name="age"
                  value={demographic.age}
                  onChange={(e: any) => this.handleChangeFor(e)}>
                  <Options>{AGES}</Options>
                </LabeledSelect>
              </Localized>

              <Localized id="demographic-form-gender" attrs={{ label: true }}>
                <LabeledSelect
                  name="sex"
                  value={demographic.sex}
                  onChange={(e: any) => this.handleChangeFor(e)}>
                  <Options>{SEXES}</Options>
                </LabeledSelect>
              </Localized>

              <LabeledCheckbox
                checked={!showLanguageSelect}
                label={
                  <Localized id="demographic-form-other-native-language">
                    <span />
                  </Localized>
                }
                onChange={(e: any) => this.toggleNativeIcelandic()}
              />
              {showLanguageSelect && (
                <Localized
                  id="demographic-form-native-language"
                  attrs={{ label: true }}>
                  <LabeledSelect
                    name="native_language"
                    value={demographic.native_language}
                    onChange={(e: any) => this.handleChangeFor(e)}>
                    <Options>{LANGUAGES}</Options>
                  </LabeledSelect>
                </Localized>
              )}
            </div>
            <ModalButtons>
              <Localized>
                <Localized id="demographic-form-submit">
                  <Button
                    outline
                    rounded
                    onClick={() => this.submitDemographic()}
                  />
                </Localized>
              </Localized>
            </ModalButtons>

            <div
              className={
                'demographic-info ' +
                (this.state.showDemographicInfo ? 'expanded' : '')
              }>
              <button
                type="button"
                onClick={() => this.setShowDemographicInfo()}>
                <Localized id="why-demographic">
                  <span />
                </Localized>

                <DownIcon />
              </button>
              <Localized id="why-demographic-explanation">
                <div className="explanation" />
              </Localized>
            </div>
          </Modal>
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
  return {
    api: state.api,
    locale: state.locale,
    sentences: Sentences.selectors.localeSentences(state),
    user: state.user,
  };
};

const mapDispatchToProps = {
  addNotification: Notifications.actions.addPill,
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
