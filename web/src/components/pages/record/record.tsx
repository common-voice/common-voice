import { connect } from 'react-redux';
import API from '../../../services/api';
import Tracker from '../../../services/tracker';
import * as React from 'react';
import { FontIcon } from '../../ui/icons';
import AudioIOS from './audio-ios';
import AudioWeb, { AudioInfo } from './audio-web';
import ERROR_MSG from '../../../error-msg';
import ListenBox from '../../listen-box/listen-box';
import Alert from '../../alert/alert';
import Modal from '../../modal/modal';
import { getItunesURL, isFocus, isNativeIOS, sleep } from '../../../utility';
import Review from './review';
import ProfileActions from './profile-actions';
import { Prompt, RouteComponentProps } from 'react-router';
import { RecordIcon } from '../../ui/icons';
import { apiSelector } from '../../../stores/root';

const CACHE_SET_COUNT = 9;
const SET_COUNT = 3;
const PAGE_NAME = 'record';
const MIN_RECORDING_LENGTH = 300; // ms
const MAX_RECORDING_LENGTH = 10000; // ms
const MIN_VOLUME = 1;
const RETRY_TIMEOUT = 1000;
const ERR_SENTENCES_NOT_LOADED =
  'Sorry! Sentences are being loaded, please wait or try again shortly.';

enum RecordingError {
  TOO_SHORT = 1,
  TOO_LONG,
  TOO_QUIET,
}

interface PropsFromState {
  api: API;
}

interface RecordProps extends RouteComponentProps<any>, PropsFromState {
  api: API;
  onSubmit(
    recordings: Blob[],
    sentences: string[],
    progressCb: Function
  ): Promise<void>;
  onRecord: Function;
  onRecordStop: Function;
  onRecordingSet: Function;
  onDelete: Function;
  onVolume(volume: number): void;
}

interface RecordState {
  sentences: string[];
  recording: boolean;
  recordingStartTime: number;
  recordingStopTime: number;
  recordings: any[];
  uploading: boolean;
  uploadProgress: number;
  isReRecord: boolean;
  reRecordIndex: number;
  alertVisible: boolean;
  showRetryModal: boolean;
  showResetModal: boolean;
}

class RecordPage extends React.Component<RecordProps, RecordState> {
  name: string = PAGE_NAME;
  audio: AudioWeb | AudioIOS;
  isUnsupportedPlatform: boolean;
  tracker: Tracker;
  sentenceCache: string[];
  maxVolume: number;

  state: RecordState = {
    sentences: [],
    recording: false,
    recordingStartTime: 0,
    recordingStopTime: 0,
    recordings: [],
    uploading: false,
    uploadProgress: 0,
    isReRecord: false,
    reRecordIndex: -1,
    alertVisible: false,
    showRetryModal: false,
    showResetModal: false,
  };

  constructor(props: RecordProps) {
    super(props);

    this.tracker = new Tracker();

    this.sentenceCache = [];
    this.refillSentenceCache().then(this.newSentenceSet.bind(this));

    // Use different audio helpers depending on if we are web or native iOS.
    if (isNativeIOS()) {
      this.audio = new AudioIOS();
    } else {
      this.audio = new AudioWeb();
    }
    this.audio.setVolumeCallback(this.updateVolume.bind(this));

    if (!this.audio.isMicrophoneSupported()) {
      this.isUnsupportedPlatform = true;
      return;
    }

    if (!this.audio.isAudioRecordingSupported()) {
      this.isUnsupportedPlatform = true;
      return;
    }

    if (isFocus()) {
      this.isUnsupportedPlatform = true;
      return;
    }

    this.maxVolume = 0;

    // Bind now, to avoid memory leak when setting handler.
    this.onSubmit = this.onSubmit.bind(this);
    this.onRecordClick = this.onRecordClick.bind(this);
    this.processRecording = this.processRecording.bind(this);
    this.goBack = this.goBack.bind(this);
    this.onProgress = this.onProgress.bind(this);
  }

  private async refillSentenceCache() {
    try {
      const newSentences = await this.props.api.getRandomSentences(
        CACHE_SET_COUNT
      );
      this.sentenceCache = this.sentenceCache.concat(newSentences);
    } catch (err) {
      console.log('could not fetch sentences');
    }
  }

  private processRecording(info: AudioInfo) {
    let recordings = this.state.recordings;
    if (this.state.isReRecord) {
      recordings.splice(this.state.reRecordIndex, 0, info);
    } else {
      recordings.push(info);
    }

    const isFull = this.isFull();

    this.setState({
      recordings: recordings,
      recording: false,
      isReRecord: false,
      reRecordIndex: -1,
      alertVisible: isFull,
    });

    this.tracker.trackRecord();

    this.props.onRecordStop && this.props.onRecordStop();

    const error = this.getRecordingError();
    if (error) {
      let message;
      switch (error) {
        case RecordingError.TOO_SHORT:
          message = 'The recording was too short.';
          break;
        case RecordingError.TOO_LONG:
          message = 'The recording was too long.';
          break;
        case RecordingError.TOO_QUIET:
          message = 'The recording was too quiet.';
          break;
        default:
          message = 'There was something wrong with the recording.';
      }
      console.log(message);
      // TODO display error to user
    }

    if (!this.props.onRecordingSet) {
      return;
    }

    if (isFull) {
      this.props.onRecordingSet();
    }
  }

  private getRecordingError(): RecordingError {
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
  }

  private deleteRecording(index: number): void {
    let recordings = this.state.recordings;
    recordings.splice(index, 1);
    this.setState({
      recordings: recordings,
      isReRecord: true,
      reRecordIndex: index,
      alertVisible: false,
    });

    this.props.onDelete();
  }

  private getRecordingUrl(which: number): string {
    let r = this.state.recordings[which] && this.state.recordings[which].url;
    return r || '';
  }

  private getSentence(which: number): string {
    let s = this.state.sentences[which] && this.state.sentences[which];
    return s || '';
  }

  private onProgress(percent: number) {
    this.setState({ uploadProgress: percent });
  }

  private updateVolume(volume: number) {
    if (!this.state.recording) {
      return;
    }

    // For some reason, volume is always exactly 100 at the end of the
    // recording, even if it is silent; so ignore that.
    if (volume !== 100 && volume > this.maxVolume) {
      this.maxVolume = volume;
    }

    if (this.props.onVolume) {
      this.props.onVolume(volume);
    }
  }

  private async onSubmit() {
    if (this.state.uploading) {
      return;
    }

    this.setState({
      uploading: true,
    });

    try {
      await this.props.onSubmit(
        this.state.recordings,
        this.state.sentences,
        this.onProgress
      );
      this.reset();
      this.tracker.trackSubmitRecordings();
    } catch (e) {
      this.setState({
        uploading: false,
      });
      this.setState({ showResetModal: true });
    }
  }

  private isFull(): boolean {
    return this.state.recordings.length >= SET_COUNT;
  }

  private goBack(): void {
    if (this.state.recordings.length < 1) {
      console.error('cannot undo, no recordings');
      return;
    }

    // If user was recording when going back, make sure to throw
    // out this new recording too.
    if (this.state.recording) {
      this.stopRecordingHard();
    }

    let recordings = this.state.recordings;
    recordings.pop();
    this.setState({
      recordings: recordings,
      alertVisible: false,
    });
  }

  private reset(): void {
    this.setState({
      recording: false,
      recordings: [],
      sentences: [],
      uploading: false,
      uploadProgress: 0,
    });
    this.newSentenceSet();
  }

  async onRecordClick(evt?: any) {
    evt.preventDefault();
    if (evt.stopImmediatePropagation) {
      evt.stopImmediatePropagation();
    }

    if (this.state.recording) {
      this.stopRecording();
      return;
    }

    // Don't start a new recording when full.
    if (this.isFull()) {
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
  }

  startRecording() {
    this.audio.start();
    this.maxVolume = 0;
    this.setState({
      recording: true,
      // TODO: re-enable display of recording time at some point.
      recordingStartTime: Date.now(),
      recordingStopTime: 0,
      alertVisible: false,
    });
    this.props.onRecord && this.props.onRecord();
  }

  stopRecording() {
    this.audio.stop().then(this.processRecording);
    this.setState({
      recordingStopTime: Date.now(),
    });
  }

  /**
   * Stop the current recording and throw out the audio.
   */
  stopRecordingHard() {
    this.audio.stop();
    this.setState({
      recording: false,
    });

    this.props.onRecordStop && this.props.onRecordStop();
  }

  private closeRetryModal = () => {
    this.setState({ showRetryModal: false });
  };

  private async newSentenceSet() {
    // If we don't have enough sentences in our cache, fill it before continuing.
    while (!this.areSentencesLoaded) {
      console.error('slow path for getting new sentences');
      await sleep(RETRY_TIMEOUT);
      await this.refillSentenceCache();
    }

    let newOnes = this.sentenceCache.splice(0, SET_COUNT);
    this.setState({ sentences: newOnes });

    // Preemptively fill sentence cache when we get low.
    if (this.sentenceCache.length < SET_COUNT * 2) {
      this.refillSentenceCache();
    }
  }

  private get areSentencesLoaded(): boolean {
    return this.sentenceCache.length >= SET_COUNT;
  }

  private closeAlert = () => {
    this.setState({
      alertVisible: false,
    });
  };

  private resetAndGoHome = () => {
    this.reset();
    this.props.history.push('/');
  };

  private closeResetModal = () => {
    this.setState({ showResetModal: false });
  };

  render() {
    // Make sure we can get the microphone before displaying anything.
    if (this.isUnsupportedPlatform) {
      return (
        <div className="unsupported">
          <h2>We're sorry, but your platform is not currently supported.</h2>
          <p key="desktop">
            On desktop computers, you can download the latest:
            <a target="_blank" href="https://www.firefox.com/">
              <FontIcon type="firefox" />Firefox
            </a>{' '}
            or
            <a target="_blank" href="https://www.google.com/chrome">
              <FontIcon type="chrome" />Chrome
            </a>
          </p>
          <p key="ios">
            <b>iOS</b> users can download our free app:
          </p>
          <a target="_blank" href={getItunesURL()}>
            <img src="/img/appstore.svg" />
          </a>
        </div>
      );
    }

    // During uploading, we display the submit page for progress.
    let texts = []; // sentence elements
    let listens = []; // listen boxes

    // Get the text prompts.
    for (let i = 0; i < SET_COUNT; i++) {
      // For the sentences elements, we need to
      // figure out where each item is positioned.
      // When rerecording, this is determined by reRecordIndex.
      // Otherwise, this is determined by the number of sentences recorded.
      let className = 'text-box';
      const length = this.state.recordings.length;
      const reRecordIndex = this.state.reRecordIndex;
      const recordIndex = this.state.isReRecord ? reRecordIndex : length;
      if (i < recordIndex) {
        className = className + ' left';
      } else if (i > recordIndex) {
        className = className + ' right';
      }

      const sentence = this.state.sentences[i];
      texts.push(
        <p key={sentence + '' + i} className={className}>
          {sentence}
        </p>
      );

      const recordingUrl = this.getRecordingUrl(i);
      listens.push(
        <ListenBox
          key={recordingUrl + '' + i}
          src={recordingUrl}
          onDelete={this.deleteRecording.bind(this, i)}
          sentence={this.getSentence(i)}
        />
      );
    }

    let showBack = this.state.recordings.length !== 0 && !this.state.isReRecord;
    let progress = this.state.uploadProgress;
    if (this.state.uploading) {
      // Look ahead in the progress bar when uploading.
      progress += 100 / SET_COUNT;
    }

    const recordingsCount = this.state.recordings.length;
    return (
      <div id="record-container">
        <Prompt
          when={recordingsCount > 0}
          message="Navigating to a different page will delete your recordings. Do you want to proceed?"
        />
        {this.state.showRetryModal && (
          <Modal
            onRequestClose={this.closeRetryModal}
            buttons={{
              Cancel: this.closeRetryModal,
              Retry: () => window.location.reload(),
            }}>
            You must allow microphone access.
          </Modal>
        )}
        {this.state.showResetModal && (
          <Modal
            buttons={{
              'Keep the recordings': this.closeResetModal,
              'Delete my recordings': this.resetAndGoHome,
            }}>
            Upload aborted. Do you want to delete your recordings?
          </Modal>
        )}
        {!this.isFull() && !this.state.uploading ? (
          <div id="voice-record">
            {this.state.alertVisible && (
              <div id="alert-container">
                <Alert autoHide onClose={this.closeAlert}>
                  Submit success! Want to record again?
                </Alert>
              </div>
            )}
            <div className="record-sentence">
              {texts}
              {recordingsCount > 0 &&
                !this.state.isReRecord && (
                  <FontIcon
                    id="undo-clip"
                    type="undo"
                    onClick={this.goBack}
                    className={!showBack ? 'hide' : ''}
                  />
                )}
            </div>
            <div className="record-controls">
              {this.areSentencesLoaded
                ? [
                    <p key="record-help" id="record-help">
                      Please tap to record, then read the above sentence aloud.
                    </p>,
                    <button
                      key="record-button"
                      id="record-button"
                      onTouchStart={this.onRecordClick}
                      onClick={this.onRecordClick}>
                      <RecordIcon size={2} />
                    </button>,
                  ]
                : ERR_SENTENCES_NOT_LOADED}
            </div>
            <p id="recordings-count">
              {!this.state.isReRecord && (
                <span>{recordingsCount + 1} of 3</span>
              )}
            </p>
            <ProfileActions />
          </div>
        ) : (
          <Review progress={progress} onSubmit={this.onSubmit}>
            {listens}
          </Review>
        )}
      </div>
    );
  }
}

export default connect<PropsFromState>((state: any) => ({
  api: apiSelector(state),
}))(RecordPage);
