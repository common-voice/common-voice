import API from '../api';
import User from '../user';
import { h, Component } from 'preact';
import AudioIOS from './record/audio-ios';
import AudioWeb from './record/audio-web';
import ERROR_MSG from '../../error-msg';
import { countSyllables, isNativeIOS, generateGUID } from '../utility';

const SOUNDCLIP_URL = '/upload/';
const PAGE_NAME = 'record';

interface RecordProps {
  active: string;
  user: User;
}

interface RecordState {
  sentence: string,
  playing: boolean,
  recording: boolean,
  recordingStartTime: number,
  recordings: any[]
}

export default class RecordPage extends Component<RecordProps, RecordState> {
  name: string = PAGE_NAME;
  audio: AudioWeb | AudioIOS;
  sentenceEl: HTMLSpanElement;
  elapsedTimeEl: HTMLDivElement;
  playButtonEl: HTMLButtonElement;
  recordButtonEl: HTMLButtonElement;
  uploadButtonEl: HTMLButtonElement;
  nextButtonEl: HTMLButtonElement;
  playerEl: HTMLMediaElement;
  api: API;

  state = {
    sentence: "",
    recording: false,
    playing: false,
    recordingStartTime: 0,
    recordings: []
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

    this.newSentence();
  }

  onRecordClick = () => {
    if (this.state.recording) {
      this.stopRecording();
    } else {
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
    this.audio.stop().then(() => {
      this.setState({ recording: false });
    });
  }

  onUploadClick = () => {
    // Save
    // var a = document.createElement('a');
    // var url = window.URL.createObjectURL(this.audio.lastRecording);
    // a.href = url;
    // a.download = "rec.ogg";
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    // window.URL.revokeObjectURL(url);

    // Upload
    let upload = new Promise(
      (resolve: EventListener, reject: EventListener) => {
        var req = new XMLHttpRequest();
        req.upload.addEventListener('load', resolve);
        req.upload.addEventListener("error", reject);
        req.open('POST', SOUNDCLIP_URL);
        req.setRequestHeader('uid', this.props.user.getId());
        req.setRequestHeader('sentence',
          encodeURIComponent(this.state.sentence));

        // For IOS, we don't upload binary data but base64. Here we
        // make sure the server knows what to expect.
        if (this.audio.lastRecordingData.type === AudioIOS.AUDIO_TYPE) {
          req.setRequestHeader('content-type', AudioIOS.AUDIO_TYPE);
        }

        req.send(this.audio.lastRecordingData);
      });

    upload.then(() => {
      console.log("Uploaded Ok.");
      this.audio.clear();
      this.newSentence();
    }).catch((e) => {
      console.error("Upload Error: " + e);
      // TODO: put this message in the DOM
      // ERROR_MSG.ERR_UPLOAD_FAILED);
    });
  }

  onPlayClick = () => {
    if (!this.audio.lastRecordingData) {
      console.error('cannot play when there is no recording');
      return;
    }

    if (this.state.playing) {
      this.playerEl.pause();
      this.setState({ playing: false });
      return;
    }

    this.playerEl.src = this.audio.lastRecordingUrl;
    this.playerEl.play();
    this.setState({ playing: true });
  }

  onPlay = () => {}

  onCanPlayThrough = () => {}

  onPlayEnded = () => {
    this.setState({ playing: false });
  }

  onNextClick = () => {
    this.audio.clear();
    this.newSentence();
  }

  newSentence() {
    this.api.getSentence().then(sentence => {
      this.setState({ sentence });
    });
  }

  render() {
    return <div id="record-container" className={this.props.active +
                (this.state.recording ? ' recording': '')}>
      <img className="robot" src="/img/robot.png" />
      <p>{this.state.recordings.length + 1} of 3</p>
      <div className="record-sentence">
          {this.state.sentence}
      </div>
      <div id="toolbar">
        <button
            onClick={this.onRecordClick} class="active" type="button"
            disabled={this.state.playing}>
          {this.state.recording ? 'Stop' : 'Record'}</button>
        <button
        onClick={this.onPlayClick} type="button"
          disabled={this.state.recording || !this.audio.lastRecordingData}>
          {this.state.playing ? 'Stop' : 'Play'}</button>
        <button onClick={this.onUploadClick} type="button"
          disabled={!this.audio.lastRecordingData || this.state.recording || this.state.playing}>
          Submit</button>
        <button onClick={this.onNextClick} type="button"
          disabled={this.state.recording || this.state.playing}>Next</button>
      </div>
      <input id="sensitivity" style="display: none" type="range" min="1" max="200"></input>
      <audio id="player" controls class="disabled"
        onCanPlayThrough={this.onCanPlayThrough}
        onPlay={this.onPlay}
        onEnded={this.onPlayEnded}

        ref={el => this.playerEl = el as HTMLAudioElement} />
    </div>;
  }
}
