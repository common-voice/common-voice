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
  message: string,
  playing: boolean,
  recording: boolean,
  recordingStartTime: number
}

export default class RecordPage extends Component<RecordProps, RecordState> {
  name: string = PAGE_NAME;
  audio: AudioWeb | AudioIOS;
  messageEl: HTMLDivElement;
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
    message: "",
    recording: false,
    playing: false,
    recordingStartTime: 0
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

  render() {
    // We are going with a reading rate of about 3 syllables per second.
    let seconds = this.state.recording ?
      countSyllables(this.state.sentence) / 3 : 0;

    return <div className={this.props.active}>
      <p class="record-message panel">{this.state.message || 'N/A'}</p>
      <div id="record-screen" class="screen disabled">
        <div id="error-screen" class="screen panel" hidden>
          <div class="panel-head">Error</div>
          <div class="panel-content">
            <p class="title" id="error-message"></p>
            <h2 hidden id="error-reload">
              Reload the page to try again
            </h2>
            <p id="error-supported">
              Please check your browser's compatibility:
              <table>
                <tr><th>Platform</th><th>Browser</th></tr>
                <tr><td>Desktop</td><td>Firefox, Chrome supported</td></tr>
                <tr><td>Android</td><td>Firefox supported</td></tr>
                <tr><td>iPhone, iPad</td><td><b>Not supported</b></td></tr>
              </table>
            </p>
          </div>
        </div>
      </div>

      <div
        style={{transitionDuration: seconds + 's'}}
        class={'record-sentence title' + (this.state.recording ? ' active' : '')}>
          {this.state.sentence}
      </div>
      <span id="record-progress" class="progress small"></span>
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
      <input id="excerpt" type="hidden" name="excerpt" value="" />
      <div id="elapsedTime" />
      <span id="upload-progress" class="progress small" />
      <input id="sensitivity" style="display: none" type="range" min="1" max="200"></input>
      <audio id="player" controls class="disabled"
        onCanPlayThrough={this.onCanPlayThrough}
        onPlay={this.onPlay}
        onEnded={this.onPlayEnded}

        ref={el => this.playerEl = el as HTMLAudioElement} />
      <div id="audio-viz" />
    </div>;
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
    this.setState({ message: "Fetching Sentence" });
    this.api.getSentence().then(sentence => {
      this.setState({ sentence });
    });
  }
}
