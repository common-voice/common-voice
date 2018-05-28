import debounce = require('lodash.debounce');
import * as React from 'react';
import { connect } from 'react-redux';
import { LocalizationProps, Localized, withLocalization } from 'fluent-react';
import ERROR_MSG from '../../../error-msg';
import API from '../../../services/api';
import { trackRecording } from '../../../services/tracker';
import { Recordings } from '../../../stores/recordings';
import StateTree from '../../../stores/tree';
import { getItunesURL, isFirefoxFocus, isNativeIOS } from '../../../utility';
import Alert from '../../alert/alert';
import Modal from '../../modal/modal';
import { FontIcon, RecordIcon } from '../../ui/icons';
import { TextButton } from '../../ui/ui';
import AudioIOS from './audio-ios';
import AudioWeb, { AudioInfo } from './audio-web';
import ProfileActions from './profile-actions';
import Review from './review';

const MIN_RECORDING_LENGTH = 300; // ms
const MAX_RECORDING_LENGTH = 10000; // ms
const MIN_VOLUME = 1;
const ERR_SENTENCES_NOT_LOADED = (
  <div className="text-box no-sentences-error">
    <p>Sorry! Sentences are being loaded, please wait or try again shortly.</p>
  </div>
);
const RECORD_DEBOUNCE_MS = 300;

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

enum RecordingError {
  TOO_SHORT = 1,
  TOO_LONG,
  TOO_QUIET,
}

interface PropsFromState {
  api: API;
  areSentencesLoaded: boolean;
  isSetFull: boolean;
  recordingsCount: number;
  reRecordSentenceId?: string;
  sentenceRecordings: Recordings.SentenceRecording[];
}

interface PropsFromDispatch {
  setRecording: typeof Recordings.actions.set;
  setReRecordSentence: typeof Recordings.actions.setReRecordSentence;
}

interface RecordProps
  extends LocalizationProps,
    PropsFromState,
    PropsFromDispatch {
  api: API;
  isRecording: boolean;
  onRecord: Function;
  onRecordStop: Function;
  onVolume(volume: number): void;
}

interface RecordState {
  recordingStartTime: number;
  recordingStopTime: number;
  showSubmitSuccess: boolean;
  showRetryModal: boolean;
  recordingError?: RecordingError;
}

class RecordPage extends React.Component<RecordProps, RecordState> {
  audio: AudioWeb | AudioIOS;
  isUnsupportedPlatform: boolean;
  maxVolume: number = 0;

  state: RecordState = {
    recordingStartTime: 0,
    recordingStopTime: 0,
    showSubmitSuccess: this.props.isSetFull,
    showRetryModal: false,
    recordingError: null,
  };

  constructor(props: RecordProps) {
    super(props);

    // Use different audio helpers depending on if we are web or native iOS.
    this.audio = isNativeIOS() ? new AudioIOS() : new AudioWeb();
    this.audio.setVolumeCallback(this.updateVolume.bind(this));

    if (
      !this.audio.isMicrophoneSupported() ||
      !this.audio.isAudioRecordingSupported() ||
      isFirefoxFocus()
    ) {
      this.isUnsupportedPlatform = true;
      return;
    }
  }

  componentDidMount() {
    document.addEventListener('visibilitychange', this.releaseMicrophone);
  }

  componentWillUnmount() {
    document.removeEventListener('visibilitychange', this.releaseMicrophone);
  }

  private releaseMicrophone = () => {
    if (!document.hidden) {
      return;
    }

    if (this.props.isRecording) {
      this.stopRecording();
    }
    this.audio.release();
  };

  private processRecording = (info: AudioInfo) => {
    const { onRecordStop, recordingsCount, sentenceRecordings } = this.props;
    onRecordStop && onRecordStop();

    const recordingError = this.getRecordingError();
    if (recordingError) {
      return this.setState({ recordingError });
    }

    this.props.setRecording(
      this.props.reRecordSentenceId ||
        sentenceRecordings[recordingsCount].sentence.id,
      info
    );

    setTimeout(() => {
      this.setState({
        showSubmitSuccess: this.props.isSetFull,
      });
    });

    trackRecording('record');
  };

  private getRecordingError = (): RecordingError => {
    const length = this.state.recordingStopTime - this.state.recordingStartTime;
    if (length < MIN_RECORDING_LENGTH) {
      return RecordingError.TOO_SHORT;
    }
    if (length > MAX_RECORDING_LENGTH) {
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

    const { onVolume } = this.props;
    onVolume && onVolume(volume);
  };

  private goBack = (): void => {
    const { recordingsCount, sentenceRecordings } = this.props;

    if (recordingsCount < 1) {
      console.error('cannot undo, no recordings');
      return;
    }

    // If user was recording when going back, make sure to throw
    // out this new recording too.
    if (this.props.isRecording) {
      this.stopRecordingHard();
    }

    this.props.setRecording(
      Object.keys(sentenceRecordings)[recordingsCount - 1],
      null
    );
    this.setState({
      showSubmitSuccess: false,
    });
  };

  private onRecordClick = debounce(async () => {
    if (this.props.isRecording) {
      this.stopRecording();
      return;
    }

    try {
      await this.audio.init();
      this.startRecording();
    } catch (err) {
      if (err === ERROR_MSG.ERR_NO_MIC) {
        this.setState({ showRetryModal: true });
      } else {
        throw err;
      }
    }
  }, RECORD_DEBOUNCE_MS);

  private startRecording() {
    this.audio.start();
    this.maxVolume = 0;
    this.setState({
      // TODO: re-enable display of recording time at some point.
      recordingStartTime: Date.now(),
      recordingStopTime: 0,
      showSubmitSuccess: false,
      recordingError: null,
    });
    this.props.onRecord && this.props.onRecord();
  }

  private stopRecording = () => {
    this.audio.stop().then(this.processRecording);
    this.setState({
      recordingStopTime: Date.now(),
    });
  };

  private stopRecordingHard = () => {
    this.audio.stop();
    this.props.onRecordStop && this.props.onRecordStop();
  };

  private closeRetryModal = () => {
    this.setState({ showRetryModal: false });
  };

  private closeSubmitSuccess = () => {
    this.setState({
      showSubmitSuccess: false,
    });
  };

  private clearRecordingError = () => {
    this.setState({ recordingError: null });
  };

  private cancelReRecord = () => {
    this.stopRecordingHard();
    this.props.setReRecordSentence(null);
  };

  render() {
    const {
      areSentencesLoaded,
      getString,
      isSetFull,
      recordingsCount,
      reRecordSentenceId,
      sentenceRecordings,
    } = this.props;
    const { recordingError, showRetryModal, showSubmitSuccess } = this.state;

    if (this.isUnsupportedPlatform) {
      return <UnsupportedInfo />;
    }

    if (!reRecordSentenceId && isSetFull) {
      return (
        <div id="record-container">
          <Review />
        </div>
      );
    }

    const recordIndex = reRecordSentenceId
      ? sentenceRecordings.findIndex(
          ({ sentence }) => sentence.id === reRecordSentenceId
        )
      : recordingsCount;

    return (
      <div id="record-container">
        {showRetryModal && (
          <Localized id="record-must-allow-microphone">
            <Modal
              onRequestClose={this.closeRetryModal}
              buttons={{
                [getString('record-cancel')]: this.closeRetryModal,
                [getString('record-retry')]: () => window.location.reload(),
              }}
            />
          </Localized>
        )}
        <div id="voice-record">
          {recordingError && (
            <div id="alert-container">
              <Localized
                id={
                  'record-error-' +
                  {
                    [RecordingError.TOO_SHORT]: 'too-short',
                    [RecordingError.TOO_LONG]: 'too-long',
                    [RecordingError.TOO_QUIET]: 'too-quiet',
                  }[recordingError]
                }>
                <Alert
                  autoHide
                  type="error"
                  onClose={this.clearRecordingError}
                />
              </Localized>
            </div>
          )}
          {!reRecordSentenceId &&
            showSubmitSuccess && (
              <div id="alert-container">
                <Localized id="record-submit-success">
                  <Alert autoHide onClose={this.closeSubmitSuccess} />
                </Localized>
              </div>
            )}
          <div className="record-sentence">
            {sentenceRecordings.map(({ sentence: { id, text } }, i) => (
              <div
                key={id + '' + i}
                className={
                  'text-box ' +
                  (i < recordIndex ? 'left' : i > recordIndex ? 'right' : '')
                }>
                <p>{text}</p>
              </div>
            ))}
            {recordingsCount > 0 &&
              !reRecordSentenceId && (
                <FontIcon id="undo-clip" type="undo" onClick={this.goBack} />
              )}
          </div>

          <div className="record-controls">
            {areSentencesLoaded ? (
              <div className="record-actions">
                <button id="record-button" onClick={this.onRecordClick}>
                  <RecordIcon />
                </button>
                {reRecordSentenceId && (
                  <Localized id="record-cancel">
                    <TextButton
                      className="rerecord"
                      onClick={this.cancelReRecord}
                    />
                  </Localized>
                )}
              </div>
            ) : (
              ERR_SENTENCES_NOT_LOADED
            )}
          </div>
          <p id="recordings-count">
            {areSentencesLoaded &&
              !reRecordSentenceId && <span>{recordingsCount + 1} of 3</span>}
          </p>
          {areSentencesLoaded && (
            <Localized id="record-help">
              <p id="record-help" />
            </Localized>
          )}
          <ProfileActions />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: StateTree) => {
  const localeRecordings = Recordings.selectors.localeRecordings(state);
  return {
    api: state.api,
    areSentencesLoaded: Recordings.selectors.areEnoughSentencesLoaded(state),
    isSetFull: Recordings.selectors.isSetFull(state),
    recordingsCount: Recordings.selectors.recordingsCount(state),
    reRecordSentenceId: localeRecordings.reRecordSentenceId,
    sentenceRecordings: localeRecordings.sentenceRecordings,
  };
};

const mapDispatchToProps = {
  setRecording: Recordings.actions.set,
  setReRecordSentence: Recordings.actions.setReRecordSentence,
};

export default connect<PropsFromState, PropsFromDispatch>(
  mapStateToProps,
  mapDispatchToProps
)(withLocalization(RecordPage));
