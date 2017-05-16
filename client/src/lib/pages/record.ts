import Page from './page';
import User from '../user';
import API from './../api';
import Audio from './record/audio';
import ERROR_MSG from '../../error-msg';
import { assert, generateGUID } from '../utility';
import {
  AnalyzerNodeView,
  LinearAnalyzerNodeView,
  RadialAnalyzerNodeView,
  SpectogramAnalyzerNodeView
} from "./../viz";

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
  api: API;
  microphone: MediaStream;
  messageEl: HTMLDivElement;
  sentenceEl: HTMLSpanElement;
  elapsedTimeEl: HTMLDivElement;
  playButtonEl: HTMLButtonElement;
  recordButtonEl: HTMLButtonElement;
  uploadButtonEl: HTMLButtonElement;
  nextButtonEl: HTMLButtonElement;
  playerEl: HTMLMediaElement;
  visualizer: AnalyzerNodeView;
  radialVisualizer: AnalyzerNodeView;
  spectrogramVisualizer: AnalyzerNodeView;
  audio: Audio;

  constructor(user: User) {
    super(user, PAGE_NAME);
    this.state = {
      sentence: "",
      message: "",
      recording: false,
      playing: false,
      recordingStartTime: 0
    }
    this.api = new API();
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
      <div id="viz">
        <canvas id="radialLevels" width=100 height=100></canvas>
      </div>
      <span id="upload-progress" class="progress small"></span>
      <input id="sensitivity" style="display: none"
                              type="range" min="1" max="200"></input>
      <audio id="player" controls="controls" class="disabled"></audio>
    </div>`;


    // <canvas id="levels" width=100 height=100></canvas>
    // <canvas id="spectrogram" width=100 height=100></canvas>

    var $ = this.content.querySelector.bind(this.content);
    this.messageEl = $('#message');
    this.sentenceEl = $('#sentence');

    let el = $('#record-screen');
    this.recordButtonEl = el.querySelector('#recordButton') as HTMLButtonElement;
    this.playButtonEl = el.querySelector('#playButton') as HTMLButtonElement;
    this.uploadButtonEl = el.querySelector('#uploadButton') as HTMLButtonElement;
    this.nextButtonEl = el.querySelector('#nextButton') as HTMLButtonElement;
    this.elapsedTimeEl = el.querySelector('#elapsedTime') as HTMLDivElement;
    this.playerEl = el.querySelector('#player') as HTMLMediaElement;
    this.playerEl.addEventListener('canplaythrough', this.onCanPlayThrough.bind(this));
    this.playerEl.addEventListener('play', this.onPlay.bind(this));
    this.playerEl.addEventListener('ended', this.onPlayEnded.bind(this));

    this.recordButtonEl.addEventListener('click', this.onRecordClick.bind(this));
    this.uploadButtonEl.addEventListener('click', this.onUploadClick.bind(this));
    this.playButtonEl.addEventListener('click', this.onPlayClick.bind(this));
    this.nextButtonEl.addEventListener('click', this.onNextClick.bind(this));
  }

  showViz() {
    let el = this.content.querySelector('#record-screen');
    // var levels = el.querySelector('#levels') as HTMLCanvasElement;
    var radialLevels = el.querySelector('#radialLevels') as HTMLCanvasElement;
    // var spectrogram = el.querySelector('#spectrogram') as HTMLCanvasElement;

    // this.visualizer = new LinearAnalyzerNodeView(this.audio.analyzerNode, levels, 384, 300);
    this.radialVisualizer = new RadialAnalyzerNodeView(this.audio.analyzerNode, radialLevels, 300, 300);
    // this.spectrogramVisualizer = new SpectogramAnalyzerNodeView(this.audio.analyzerNode, spectrogram, 500, 300);

  }

  onRecordClick() {
    if (this.state.recording) {
      this.stopRecording();
    } else {

      // If we already have microphone permissions, start recording.
      if (this.microphone) {
        this.startRecording()
        return;
      }

      // Prompt for microphone permission before setting up visuals.
      Audio.getMicrophone().then((microphone) => {
        this.microphone = microphone;
        this.audio = new Audio(microphone);
        this.showViz();
        this.startRecording();
      });
    }
  }

  recordingInterval = 0;
  startRecording() {
    this.setState({
      recording: true,
      recordingStartTime: this.audio.audioContext.currentTime
    } as any);
    this.recordingInterval = setInterval(() => {
      this.forceUpdate();
    });
    this.audio.start();
  }

  stopRecording() {
    this.setState({ recording: false } as any);
    assert(this.recordingInterval);
    clearInterval(this.recordingInterval);
    this.recordingInterval = 0;
    this.audio.stop().then(() => {
      this.forceUpdate();
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
        req.send(this.audio.lastRecording);
      });

    upload.then(function() {
      console.log("Uploaded Ok.");
    }).catch(function(e) {
      console.error("Upload Error: " + e);
      // TODO: put this message in the DOM
      // ERROR_MSG.ERR_UPLOAD_FAILED);
    });
  }
  onPlayClick() {
    this.playerEl.src = URL.createObjectURL(this.audio.lastRecording);
    if (this.state.playing) {
      this.playerEl.pause();
      this.setState({ playing: false } as any);
      return;
    }
    this.playerEl.play();
    this.setState({ playing: true } as any);
  }
  onPlay() {

  }
  onCanPlayThrough() {

  }
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
    this.messageEl.textContent = this.state.message ? `${this.state.message}` : "N/A";

    // Only update the radio tools if we've been granted microphone access.
    if (!this.microphone) {
      return;
    }

    this.recordButtonEl.textContent = this.state.recording ? 'Stop' : 'Record';
    this.playButtonEl.textContent = this.state.playing ? 'Stop' : 'Play';

    // this.visualizer.isRecording = this.state.recording;
    this.radialVisualizer.isRecording = this.state.recording;
    // this.spectrogramVisualizer.isRecording = this.state.recording;

    if (this.state.recording) {
      let elapsedTime = this.audio.audioContext.currentTime - this.state.recordingStartTime;
      // this.elapsedTimeEl.innerText = elapsedTime.toFixed(2);
    }

    // TODO: 20 chars per second is a reasonable reading speed. We could adapt to the user.
    let time = Math.ceil(this.state.sentence.length / 20);
    if (this.state.recording) {
      this.sentenceEl.style.transition = `background-position ${time}s linear`;
    } else {
      this.sentenceEl.style.transition = `none`;
    }
    this.sentenceEl.classList.toggle('active', this.state.recording);

    this.recordButtonEl.classList.toggle('disabled', this.state.playing);
    this.playButtonEl.classList.toggle('disabled', this.state.recording || !this.audio.lastRecording);
    this.uploadButtonEl.classList.toggle('disabled', !this.audio.lastRecording || this.state.recording || this.state.playing);
    this.nextButtonEl.classList.toggle('disabled', this.state.recording || this.state.playing);
  }

  init(navHandler: Function) {
    super.init(navHandler);
    this.mount();
  }

  show() {
    super.show();

    // If we already grabbed he micorphone before, we're done.
    if (this.microphone) {
      return;
    }

    // Trigger page update.
    this.newSentence();
  }
}
