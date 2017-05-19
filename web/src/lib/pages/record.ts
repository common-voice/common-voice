import Page from './page';
import User from '../user';
import AudioBase from './record/audio-base';
import AudioIOS from './record/audio-ios';
import AudioWeb from './record/audio-web';
import ERROR_MSG from '../../error-msg';
import { countSyllables, isNativeIOS, generateGUID } from '../utility';

const REPLAY_TIMEOUT = 200;
const SOUNDCLIP_URL = '/upload/';
const PAGE_NAME = 'record';

interface RecordState {
  sentence: string,
  message: string,
  playing: boolean,
  recording: boolean,
  recordingStartTime: number
}

export default class RecordPage extends Page<RecordState> {
  name: string = PAGE_NAME;
  audio: AudioBase;
  messageEl: HTMLDivElement;
  sentenceEl: HTMLSpanElement;
  elapsedTimeEl: HTMLDivElement;
  playButtonEl: HTMLButtonElement;
  recordButtonEl: HTMLButtonElement;
  uploadButtonEl: HTMLButtonElement;
  nextButtonEl: HTMLButtonElement;
  playerEl: HTMLMediaElement;

  constructor(user: User) {
    super(user, PAGE_NAME);
    this.state = {
      sentence: "",
      message: "",
      recording: false,
      playing: false,
      recordingStartTime: 0
    }

    // Use different audio helpers depending on if we are web or native iOS.
    if (isNativeIOS()) {
      this.audio = new AudioIOS(this.content);
    } else {
      this.audio = new AudioWeb(this.content);
    }
  }

  mount() {
    this.content.innerHTML = `
    <p id="message" class="panel"></p>
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
              <tr><th>Platform<th>Browser</tr>
              <tr><td>Desktop<td>Firefox, Chrome supported</tr>
              <tr><td>Android<td>Firefox supported</tr>
              <tr><td>iPhone, iPad<td><b>Not supported</b></tr>
            </table>
          </p>
        </div>
      </div>

      <div id="sentence" class="title">Say something out loud!</div>
      <span id="record-progress" class="progress small"></span>
      <div id="toolbar">
        <button id="recordButton" class="active" type="button">Record</button>
        <button id="playButton" type="button">Play</button>
        <button id="uploadButton" type="button">Submit</button>
        <button id="nextButton" type="button">Next</button>
      </div>
      <input id="excerpt" type="hidden" name="excerpt" value="">
      <div id="elapsedTime"></div>
      <span id="upload-progress" class="progress small"></span>
      <input id="sensitivity" style="display: none"
                              type="range" min="1" max="200"></input>
      <audio id="player" controls="controls" class="disabled"></audio>
    </div>`;

    var $ = this.content.querySelector.bind(this.content);
    this.messageEl = $('#message');
    this.sentenceEl = $('#sentence');

    let el = $('#record-screen');
    this.recordButtonEl =
      el.querySelector('#recordButton') as HTMLButtonElement;
    this.playButtonEl =
      el.querySelector('#playButton') as HTMLButtonElement;
    this.uploadButtonEl =
      el.querySelector('#uploadButton') as HTMLButtonElement;
    this.nextButtonEl =
      el.querySelector('#nextButton') as HTMLButtonElement;
    this.elapsedTimeEl =
      el.querySelector('#elapsedTime') as HTMLDivElement;
    this.playerEl =
      el.querySelector('#player') as HTMLMediaElement;

    this.playerEl.addEventListener('canplaythrough',
      this.onCanPlayThrough.bind(this));
    this.playerEl.addEventListener('play', this.onPlay.bind(this));
    this.playerEl.addEventListener('ended', this.onPlayEnded.bind(this));
    this.playerEl.addEventListener('error', (err: ErrorEvent) => {
      console.log('got audio error', err.message);
    });

    this.recordButtonEl.addEventListener('click',
      this.onRecordClick.bind(this));
    this.uploadButtonEl.addEventListener('click',
      this.onUploadClick.bind(this));
    this.playButtonEl.addEventListener('click', this.onPlayClick.bind(this));
    this.nextButtonEl.addEventListener('click', this.onNextClick.bind(this));
  }

  onRecordClick() {
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
    } as any);
    this.audio.start();
  }

  stopRecording() {
    this.audio.stop().then(() => {
      this.setState({ recording: false } as any);
    });
  }

  onUploadClick() {
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
        req.setRequestHeader('uid', this.user.getId());
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

  onPlayClick() {
    if (!this.audio.lastRecordingData) {
      console.error('cannot play when there is no recording');
      return;
    }

    if (this.state.playing) {
      this.playerEl.pause();
      this.setState({ playing: false } as any);
      return;
    }

    this.playerEl.src = this.audio.lastRecordingUrl;
    this.playerEl.play();
    this.setState({ playing: true } as any);
  }

  onPlay() {}

  onCanPlayThrough() {}

  onPlayEnded() {
    this.setState({ playing: false } as any);
  }

  onNextClick() {
    this.newSentence();
  }

  newSentence() {
    this.setState({ message: "Fetching Sentence" } as any);
    this.api.getSentence().then(sentence => {
      this.setState({ sentence } as any);
    });
  }

  update() {
    super.update();
    this.sentenceEl.textContent = `${this.state.sentence}`;
    this.messageEl.textContent = this.state.message ?
      `${this.state.message}` : "N/A";

    this.recordButtonEl.textContent =
      this.state.recording ? 'Stop' : 'Record';
    this.playButtonEl.textContent = 
      this.state.playing ? 'Stop' : 'Play';

    // TODO: re-enable getting elapsed recording time at some point.
    /*
    if (this.state.recording) {
      let elapsedTime = this.audio.audioContext.currentTime - this.state.recordingStartTime;
      // this.elapsedTimeEl.innerText = elapsedTime.toFixed(2);
    }
     */

    if (this.state.sentence) {
      let syllables = countSyllables(this.state.sentence);

      // We are going with a reading rate of about 3 syllables per second.
      let seconds = syllables / 3;
      if (this.state.recording) {
        this.sentenceEl.style.transitionDuration = seconds + 's';
      } else {
        this.sentenceEl.style.transitionDuration = '0s';
      }

      this.sentenceEl.classList.toggle('active', this.state.recording);
    }

    this.recordButtonEl.classList.toggle('disabled', this.state.playing);
    this.playButtonEl.classList.toggle('disabled',
      this.state.recording || !this.audio.lastRecordingData);
    this.uploadButtonEl.classList.toggle('disabled',
      !this.audio.lastRecordingData || this.state.recording || this.state.playing);
    this.nextButtonEl.classList.toggle('disabled',
      this.state.recording || this.state.playing);
  }

  init(navHandler: Function) {
    super.init(navHandler);
    this.mount();
  }

  show() {
    super.show();

    // Grab a sentence if we don't already have one.
    if (!this.state.sentence) {
      this.newSentence();
    }
  }
}
