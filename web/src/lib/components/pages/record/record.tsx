import API from '../../../api';
import User from '../../../user';
import Tracker from '../../../tracker';
import { h, Component } from 'preact';
import Icon from '../../icon';
import AudioIOS from './audio-ios';
import AudioWeb, { AudioInfo } from './audio-web';
import ListenBox from '../../listen-box/listen-box';
import ProgressButton from '../../progress-button';
import { getItunesURL, isFocus, isNativeIOS, sleep } from '../../../utility';
import confirm from '../../../confirm/confirm';

const CACHE_SET_COUNT = 9;
const SET_COUNT = 3;
const PAGE_NAME = 'record';
const MIN_RECORDING_LENGTH = 300; // ms
const MAX_RECORDING_LENGTH = 10000; // ms
const MIN_VOLUME = 1;
const RETRY_TIMEOUT = 1000;
const ERR_SENTENCES_NOT_LOADED =
  'Sorry! Sentinces are being loaded, please wait or try again shortly.';

enum RecordingError {
  TOO_SHORT = 1,
  TOO_LONG,
  TOO_QUIET,
}

interface RecordProps {
  active: string;
  user: User;
  api: API;
  navigate(url: string): void;
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
}

export default class RecordPage extends Component<RecordProps, RecordState> {
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
    recordings.push(info);

    this.setState({
      recordings: recordings,
      recording: false,
      isReRecord: false,
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

    if (this.isFull()) {
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
    // Move redo sentence to the end.
    let sentences = this.state.sentences;
    let redoSentence = sentences.splice(index, 1);
    sentences.push(redoSentence[0]);

    let recordings = this.state.recordings;
    recordings.splice(index, 1);
    this.setState({
      recordings: recordings,
      sentences: sentences,
      isReRecord: true,
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
      const keep = await confirm(
        'Upload aborted. Do you want to delete your recordings?',
        'Keep the recordings',
        'Delete my recordings'
      );
      if (!keep) {
        this.reset();
        this.props.navigate('/');
      }
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
    evt.stopImmediatePropagation();

    if (this.state.recording) {
      this.stopRecording();

      // Don't start a new recording when full.
    } else if (!this.isFull()) {
      await this.audio.init();
      this.startRecording();
    }
  }

  startRecording() {
    this.audio.start();
    this.maxVolume = 0;
    this.setState({
      recording: true,
      // TODO: reanble display of recording time at some point.
      recordingStartTime: Date.now(),
      recordingStopTime: 0,
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

  private async newSentenceSet() {
    // If we don't have enough sentences in our cache, fill it before continuing.
    while (!this.areSentencesLoaded) {
      console.error('slow path for getting new sentences');
      await sleep(RETRY_TIMEOUT);
      await this.refillSentenceCache();
    }

    let newOnes = this.sentenceCache.splice(0, SET_COUNT);
    this.setState({ sentences: newOnes });

    // Preemptively fill setnece cache when we get low.
    if (this.sentenceCache.length < SET_COUNT * 2) {
      this.refillSentenceCache();
    }
  }

  private get areSentencesLoaded(): boolean {
    return this.sentenceCache.length >= SET_COUNT;
  }

  render() {
    // Make sure we can get the microphone before displaying anything.
    if (this.isUnsupportedPlatform) {
      return (
        <div className={'unsupported ' + this.props.active}>
          <h2>We're sorry, but your platform is not currently supported.</h2>
          <p>
            On desktop computers, you can download the latest:
            <a target="_blank" href="https://www.firefox.com/">
              <Icon type="firefox" />Firefox
            </a>{' '}
            or
            <a target="_blank" href="https://www.google.com/chrome">
              <Icon type="chrome" />Chrome
            </a>
          </p>
          <p>
            <b>iOS</b> users can download our free app:
          </p>
          <a target="_blank" href={getItunesURL()}>
            <img src="/img/appstore.svg" />
          </a>
        </div>
      );
    }

    // During uploading, we display the submit page for progress.
    let isFull = this.isFull() || this.state.uploading;
    let texts = []; // sentence elements
    let listens = []; // listen boxes

    // Get the text prompts.
    for (let i = 0; i < SET_COUNT; i++) {
      // For the sentences elements, we need to
      // figure out where each item is positioned.
      let className = 'text-box';
      let length = this.state.recordings.length;
      if (i < length) {
        className = className + ' left';
      } else if (i > length) {
        className = className + ' right';
      }

      texts.push(<p className={className}>{this.state.sentences[i]}</p>);

      listens.push(
        <ListenBox
          src={this.getRecordingUrl(i)}
          onDelete={this.deleteRecording.bind(this, i)}
          sentence={this.getSentence(i)}
        />
      );
    }

    let showBack = this.state.recordings.length !== 0 && !this.state.isReRecord;
    let className = this.props.active + (isFull ? ' full' : '');
    let progress = this.state.uploadProgress;
    if (this.state.uploading) {
      // Look ahead in the progress bar when uploading.
      progress += 100 / SET_COUNT * 1;
    }

    const controlElements = this.areSentencesLoaded
      ? [
          <p id="record-help">
            Please tap to record, then read the above sentence aloud.
          </p>,
          <div
            id="record-button"
            onTouchStart={this.onRecordClick}
            onClick={this.onRecordClick}
          />,
        ]
      : ERR_SENTENCES_NOT_LOADED;

    return (
      <div id="record-container" className={className}>
        <div id="voice-record">
          <div className="record-sentence">
            {texts}
            <Icon
              id="undo-clip"
              type="undo"
              onClick={this.goBack}
              className={!showBack ? 'hide' : ''}
            />
          </div>
          <div class="record-controls">{controlElements}</div>
          <p id="recordings-count">
            <span style={this.state.isReRecord ? 'display: none;' : ''}>
              {this.state.recordings.length + 1} of 3
            </span>
          </p>
        </div>
        <div id="voice-submit">
          <p id="thank-you">
            <span>Review &amp; Submit</span>
          </p>
          <p id="want-to-review">
            <span>
              Thank you for recording! Now review and submit your clips below.
            </span>
          </p>
          <p id="box-headers">
            <span>Review</span>
            <span>Re-record</span>
          </p>
          {listens}
          <ProgressButton
            percent={progress}
            disabled={this.state.uploading}
            onClick={this.onSubmit}
            text="Submit"
          />
        </div>
      </div>
    );
  }
}
