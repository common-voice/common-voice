import API from '../../api';
import User from '../../user';
import Tracker from '../../tracker';
import { h, Component } from 'preact';
import Icon from '../icon';
import AudioIOS from './record/audio-ios';
import AudioWeb, { AudioInfo } from './record/audio-web';
import ListenBox from '../listen-box';
import ProgressButton from '../progress-button';
import ERROR_MSG from '../../../error-msg';
import { getItunesURL, isFocus, countSyllables, isNativeIOS, generateGUID }
  from '../../utility';
import confirm from '../confirm';

const SET_COUNT = 3;
const PAGE_NAME = 'record';

interface RecordProps {
  active: string;
  user: User;
  api: API;
  navigate(url: string): void;
  onSubmit(recordings: Blob[], sentences: string[]): Promise<void>;
  onRecord: Function;
  onRecordStop: Function;
  onRecordingSet: Function;
  onDelete: Function;
}

interface RecordState {
  sentences: string[],
  recording: boolean,
  recordingStartTime: number,
  recordings: any[],
  uploadProgress: number,
  isReRecord: boolean
}

export default class RecordPage extends Component<RecordProps, RecordState> {
  name: string = PAGE_NAME;
  audio: AudioWeb | AudioIOS;
  isUnsupportedPlatform: boolean;
  tracker: Tracker;

  state = {
    sentences: [],
    recording: false,
    recordingStartTime: 0,
    recordings: [],
    uploadProgress: 0,
    isReRecord: false
  };

  constructor(props) {
    super(props);

    this.tracker = new Tracker();

    // Use different audio helpers depending on if we are web or native iOS.
    if (isNativeIOS()) {
      this.audio = new AudioIOS();
    } else {
      this.audio = new AudioWeb();
    }

    if (!this.audio.isMicrophoneSupported()) {
      this.isUnsupportedPlatform = true;
      return;
    }

    if (isFocus()) {
      this.isUnsupportedPlatform = true;
      return;
    }

    this.newSentenceSet();

    // Bind now, to avoid memory leak when setting handler.
    this.onSubmit = this.onSubmit.bind(this);
    this.onRecordClick = this.onRecordClick.bind(this);
    this.processRecording = this.processRecording.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  private processRecording(info: AudioInfo) {
    let recordings = this.state.recordings;
    recordings.push(info);

    this.setState({
      recordings: recordings,
      recording: false,
      isReRecord: false
    });

    this.tracker.trackRecord();

    this.props.onRecordStop && this.props.onRecordStop();

    if (!this.props.onRecordingSet) {
      return;
    }

    if (this.isFull()) {
      this.props.onRecordingSet();
    }
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

  private onSubmit() {
    this.props.onSubmit(this.state.recordings, this.state.sentences)
      .then(() => {
        this.reset();
        this.tracker.trackSubmitRecordings();
      })
      .catch(() => {
        confirm('You did not agree to our Terms of Service. Do you want to delete your recordings?', 'Keep the recordings', 'Delete my recordings').then((keep) => {
          if (!keep) {
            this.reset();
            this.props.navigate('/');
          }
        })
      });
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
      recordings: [],
      sentences: [],
      uploadProgress: 0
    });
    this.newSentenceSet();
  }

  onRecordClick() {
    if (this.state.recording) {
      this.stopRecording();

    // Don't start a new recording when full.
    } else if (!this.isFull()) {
      this.audio.init().then(() => {
        this.startRecording();
      });
    }
  }

  startRecording() {
    this.audio.start();
    this.setState({
      recording: true,
      // TODO: reanble display of recording time at some point.
      // recordingStartTime: this.audio.audioContext.currentTime
    });
    this.props.onRecord && this.props.onRecord();
  }

  stopRecording() {
    this.audio.stop().then(this.processRecording);;
  }

  /**
   * Stop the current recording and throw out the audio.
   */
  stopRecordingHard() {
    this.audio.stop();
    this.setState({
      recording: false
    });

    this.props.onRecordStop && this.props.onRecordStop();
  }

  newSentenceSet() {
    let recordedSentenceCount = this.state.recordings.length;
    let numberOfSentenceToGet = SET_COUNT - recordedSentenceCount;
    this.props.api.getRandomSentences(numberOfSentenceToGet).then(newSentences => {
      let targetSentences = this.state.sentences.slice(0,recordedSentenceCount);
      targetSentences = targetSentences.concat(newSentences.split('\n'));
      this.setState({ sentences: targetSentences});
    });
  }

  render() {
    // Make sure we can get the microphone before displaying anything.
    if (this.isUnsupportedPlatform) {
      return <div className={'unsupported ' + this.props.active}>
        <h2>
          We're sorry, but your platform is not currently supported.
        </h2>
        <p>
          On desktop computers, you can download the latest:
          <a target="_blank" href="https://www.firefox.com/">
            <Icon type="firefox" />Firefox</a> or
          <a target="_blank" href="https://www.google.com/chrome">
            <Icon type="chrome" />Chrome</a>
        </p>
        <p><b>iOS</b> users can download our free app:</p>
        <a target="_blank" href={getItunesURL()}><img src="/img/appstore.svg" /></a>
      </div>;
    }

    let isFull = this.isFull();
    let texts = [];   // sentence elements
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

      texts.push(<p className={className}>
        {this.state.sentences[i]}
      </p>);

      listens.push(<ListenBox src={this.getRecordingUrl(i)}
                              onDelete={this.deleteRecording.bind(this, i)}
                              sentence={this.getSentence(i)}/>);
    }

    let showBack = this.state.recordings.length !== 0 && !this.state.isReRecord;
    let className = this.props.active + (isFull ? ' full': '');

    return <div id="record-container" className={className}>
      <div id="voice-record">
        <p id="recordings-count">
          <span style={this.state.isReRecord ? 'display: none;' : ''}>
            {this.state.recordings.length + 1} of 3</span>
        </p>
        <div className="record-sentence">
          {texts}
          <Icon id="undo-clip" type="undo" onClick={this.goBack}
            className={!showBack ? 'hide' : ''}/>
        </div>
        <div id="record-button" onClick={this.onRecordClick}></div>
        <p id="record-help">
          Please tap to record, then read the above sentence aloud.
        </p>
      </div>
      <div id="voice-submit">
        <p id="thank-you"><span>Thank you!</span></p>
        <p id="want-to-review"><span>Want to review your recording?</span></p>
        <p id="box-headers">
          <span>Play/Stop</span>
          <span>Re-record</span>
        </p>
        {listens}
        <ProgressButton percent={this.state.uploadProgress}
                        onClick={this.onSubmit} text="Submit" />
      </div>
    </div>;
  }
}
