import API from '../../api';
import User from '../../user';
import { h, Component } from 'preact';
import Icon from '../icon';
import AudioIOS from './record/audio-ios';
import AudioWeb, { AudioInfo } from './record/audio-web';
import ListenBox from '../listen-box';
import ProgressButton from '../progress-button';
import ERROR_MSG from '../../../error-msg';
import { countSyllables, isNativeIOS, generateGUID } from '../../utility';
import confirm from '../confirm';

const SET_COUNT = 3;
const PAGE_NAME = 'record';

interface RecordProps {
  active: string;
  user: User;
  api: API;
  navigate(url: string): void;
  onRecordingSet(recordings: Blob[], sentences: string[]): Promise<void>;
}

interface RecordState {
  sentences: string[],
  recording: boolean,
  recordingStartTime: number,
  recordings: any[],
  uploadProgress: number
}

export default class RecordPage extends Component<RecordProps, RecordState> {
  name: string = PAGE_NAME;
  audio: AudioWeb | AudioIOS;
  isUnsupportedPlatform: boolean;

  state = {
    sentences: [],
    recording: false,
    recordingStartTime: 0,
    recordings: [],
    uploadProgress: 0
  };

  constructor(props) {
    super(props);

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

    this.newSentenceSet();

    // Bind now, to avoid memory leak when setting handler.
    this.onSetReady = this.onSetReady.bind(this);
    this.onRecordClick = this.onRecordClick.bind(this);
    this.processRecording = this.processRecording.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  private processRecording(info: AudioInfo) {
    let recordings = this.state.recordings;
    recordings.push(info);

    this.setState({
      recordings: recordings,
      recording: false
    });
  }

  private getRecordingUrl(which: number): string {
    let r = this.state.recordings[which] && this.state.recordings[which].url;
    return r || '';
  }

  private getSentence(which: number): string {
    let s = this.state.sentences[which] && this.state.sentences[which];
    return s || '';
  }

  private onSetReady() {
    this.props.onRecordingSet(this.state.recordings, this.state.sentences)
      .then(() => {
        // TODO: display thank you page!
        this.reset();
      })
      .catch(() => {
        confirm('You did not agree to our Privacy Policy. Do you want to delete your recordings?', 'Keep the recordings', 'Delete my recordings').then((keep) => {
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

    let r = this.state.recordings;
    r.pop();
    this.setState({
      recordings: r
    });
  }

  private reset(): void {
    this.newSentenceSet();
    this.setState({
      recordings: [],
      sentences: [],
      uploadProgress: 0
    });
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
    this.audio.start().then(() => {
      this.setState({
        recording: true,
        // TODO: reanble display of recording time at some point.
        // recordingStartTime: this.audio.audioContext.currentTime
      });
    });
  }

  stopRecording() {
    this.audio.stop().then(this.processRecording);;
  }

  onNextClick = () => {
    this.audio.clear();
    this.newSentenceSet();
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
        <p>For iPhones and iPads, an <b>iOS app</b> is coming soon!</p>
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
        <Icon className="refresh" type="redo" onClick={this.onNextClick} />
      </p>);

      listens.push(<ListenBox src={this.getRecordingUrl(i)}
                   sentence={this.getSentence(i)}/>);
    }

    let className = this.props.active +
      (this.state.recording ? ' recording': '') +
      (isFull ? ' full': '');

    return <div id="record-container" className={className}>
      <div id="voice-record">
        <p id="recordings-count">{this.state.recordings.length + 1} of 3</p>
        <div className="record-sentence">
          {texts}
          <Icon id="undo-clip" type="undo" onClick={this.goBack}
            className={(this.state.recordings.length === 0 ? 'hide' : '')}/>
        </div>
        <p onClick={this.onNextClick} id="refresh-help">Skip this sentence</p>
        <div id="record-button" onClick={this.onRecordClick}></div>
        <p id="record-help">
          Please read the above sentence and tap to record.
        </p>
      </div>
      <div id="voice-submit">
        <p id="thank-you">Thank you!</p>
        <p id="want-to-review">Want to review your recording?</p>
        <p id="tap-to-play">Tap to play/stop</p>
        {listens}
        <ProgressButton percent={this.state.uploadProgress}
                        onClick={this.onSetReady} text="Submit" />
      </div>
    </div>;
  }
}
