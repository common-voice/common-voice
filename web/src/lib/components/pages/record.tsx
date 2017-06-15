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

const SET_COUNT = 3;
const SOUNDCLIP_URL = '/upload/';
const PAGE_NAME = 'record';

interface RecordProps {
  active: string;
  user: User;
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
  api: API;

  state = {
    sentences: [],
    recording: false,
    recordingStartTime: 0,
    recordings: [],
    uploadProgress: 0
  };

  constructor() {
    super();
    this.api = new API();
    // Use different audio helpers depending on if we are web or native iOS.
    if (isNativeIOS()) {
      this.audio = new AudioIOS();
    } else {
      this.audio = new AudioWeb();
    }

    this.newSentenceSet();

    // Bind now, to avoid memory leak when setting handler.
    this.uploadSet = this.uploadSet.bind(this);
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

  private uploadOne(blob: Blob, sentence: string, progress?: Function) {
    return new Promise((resolve: EventListener, reject: EventListener) => {
      var req = new XMLHttpRequest();
      req.upload.addEventListener('load', resolve);
      req.upload.addEventListener("error", reject);
      req.open('POST', SOUNDCLIP_URL);
      req.setRequestHeader('uid', this.props.user.getId());
      req.setRequestHeader('sentence',
        encodeURIComponent(sentence));

      // For IOS, we don't upload binary data but base64. Here we
      // make sure the server knows what to expect.
      if (blob.type === AudioIOS.AUDIO_TYPE) {
        req.setRequestHeader('content-type', AudioIOS.AUDIO_TYPE);
      }

      if (progress) {
        req.addEventListener('progress', evt => {
          let total = evt.lengthComputable ? evt.total : 100;
          progress(100 * evt.loaded / total);
        });
      }

      req.send(blob);
    });
  }

  private uploadSet() {
    let recordings = this.state.recordings;
    let sentences = this.state.sentences;
    let runningTotal = 0;
    let uploadNext = () => {

      if (recordings.length === 0) {
        this.newSentenceSet();
        this.setState({
          recordings: [],
          sentences: [],
          uploadProgress: 0
        });
        return;
      }

      let recording = recordings.pop();
      let blob = recording.blob;
      let sentence = sentences.pop();

      this.uploadOne(blob, sentence).then(() => {
        runningTotal += 100 / SET_COUNT;
        this.setState({ uploadProgress: runningTotal });
        uploadNext();
      });
    };

    // Start the recursive chain to upload the recordings serially.
    uploadNext();
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
    this.setState({
      recording: true,
      // TODO: reanble display of recording time at some point.
      // recordingStartTime: this.audio.audioContext.currentTime
    });
    this.audio.start();
  }

  stopRecording() {
    this.audio.stop().then(this.processRecording);;
  }

  onNextClick = () => {
    this.audio.clear();
    this.newSentenceSet();
  }

  newSentenceSet() {
    this.api.getRandomSentences(SET_COUNT).then(sentences => {
      this.setState({ sentences: sentences.split('\n') });
    });
  }

  render() {
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
                        onClick={this.uploadSet} text="Submit" />
      </div>
    </div>;
  }
}
