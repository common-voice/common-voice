import API from './../lib/api';
import { AnalyzerNodeView, LinearAnalyzerNodeView, RadialAnalyzerNodeView, SpectogramAnalyzerNodeView } from "./../lib/viz";

export function assert(c: any, message: string = "") {
  if (!c) {
    throw new Error(message);
  }
}

declare var MediaRecorder: any;

// These are some things that can go wrong:
var ERR_NO_RECORDING = 'Please record first.';
var ERR_NO_PLAYBACK = 'Please listen before submitting.';
var ERR_PLATFORM = 'Your browser does not support audio recording.';
var ERR_NO_CONSENT = 'You did not consent to recording. ' +
  'You must click the "I Agree" button in order to use this website.';
var ERR_NO_MIC = 'You did not allow this website to use the microphone. ' +
  'The website needs the microphone to record your voice.';
var ERR_UPLOAD_FAILED = 'Uploading your recording to the server failed. ' +
  'This may be a temporary problem. Please try again.';
var ERR_DATA_FAILED = 'Submitting your profile data failed. ' +
  'This may be a temporary problem. Please try again.';
var REPLAY_TIMEOUT = 200;

var SOUNDCLIP_URL = '/upload/';

function generateGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function getUserId() {
  if (localStorage.userId) {
    return localStorage.userId;
  }
  localStorage.userId = generateGUID();
  return localStorage.userId;
}

export class Component<State> {
  state: State = Object.create(null);
  updateTimeout: number;
  setState(state: State) {
    let needsUpdating = false;
    for (let k in state) {
      if (this.state[k] != state[k]) {
        this.state[k] = state[k];
        needsUpdating = true;
      }
    }
    if (needsUpdating) {
      this.forceUpdate();
    }
  }
  forceUpdate() {
    if (this.updateTimeout) {
      return;
    }
    this.updateTimeout = setTimeout(() => {
      this.update();
      this.updateTimeout = 0;
    });
  }
  update() {

  }
}

export class Audio {
  analyzerNode: AnalyserNode;
  audioContext: AudioContext;
  recorder: any;
  lastRecording: Blob;
  private chunks = [];
  constructor(microphone) {
    var audioContext = new AudioContext();
    var sourceNode = audioContext.createMediaStreamSource(microphone);
    var volumeNode = audioContext.createGain();
    var analyzerNode = audioContext.createAnalyser();
    var outputNode = audioContext.createMediaStreamDestination();
    // Make sure we're doing mono everywhere.
    sourceNode.channelCount = 1;
    volumeNode.channelCount = 1;
    analyzerNode.channelCount = 1;
    outputNode.channelCount = 1;
    // Connect the nodes together
    sourceNode.connect(volumeNode);
    volumeNode.connect(analyzerNode);
    analyzerNode.connect(outputNode);
    // and set up the recorder.
    this.recorder = new MediaRecorder(outputNode.stream);

    // Set up the analyzer node, and allocate an array for its data
    // FFT size 64 gives us 32 bins. But those bins hold frequencies up to
    // 22kHz or more, and we only care about visualizing lower frequencies
    // which is where most human voice lies, so we use fewer bins
    analyzerNode.fftSize = 128;

    // Another audio node used by the beep() function
    var beeperVolume = audioContext.createGain();
    beeperVolume.connect(audioContext.destination);

    this.analyzerNode = analyzerNode;
    this.audioContext = audioContext;
  }
  start() {
    this.recorder.ondataavailable = (e) => {
      console.log("Recording ...");
      this.chunks.push(e.data);
    };

    // We want to be able to record up to 60s of audio in a single blob.
    // Without this argument to start(), Chrome will call dataavailable
    // very frequently.
    this.recorder.start(20000);
  }
  stop() {
    let self = this;
    return new Promise(function (res, reject) {
      self.recorder.onstop = (e) => {
        console.log("Recorder Stopped");
        var blob = new Blob(self.chunks, { 'type': 'audio/ogg; codecs=opus' });
        self.chunks = [];
        self.lastRecording = blob;
        res(blob);
      };
      self.recorder.stop();
    });
  }
  static getMicrophone(): Promise<MediaStream> {
    return new Promise(function (res, reject) {
      function resolve(stream) {
        res(stream);
      }
      // Reject the promise with a 'permission denied' error code
      function deny() { reject(ERR_NO_MIC); }

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(resolve, deny);
      }
      else if (navigator.getUserMedia) {
        navigator.getUserMedia({ audio: true }, resolve, deny);
      }
      else if (navigator.webkitGetUserMedia) {
        navigator.webkitGetUserMedia({ audio: true }, resolve, deny);
      }
      else if (navigator.mozGetUserMedia) {
        navigator.mozGetUserMedia({ audio: true }, resolve, deny);
      }
      else {
        reject(ERR_PLATFORM);  // Browser does not support getUserMedia
      }
    });
  }
}

export class RecordComponent extends Component<{
  sentence: string,
  message: string,
  playing: boolean,
  recording: boolean,
  recordingStartTime: number
}> {
  api: API;
  messageEl: HTMLDivElement;
  sentenceEl: HTMLDivElement;
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
  constructor(private container: HTMLDivElement, microphone: MediaStream) {
    super();
    this.state = {
      sentence: "",
      message: "",
      recording: false,
      playing: false,
      recordingStartTime: 0
    }
    this.api = new API();
    this.audio = new Audio(microphone);
    this.mount();
    this.newSentence();
  }
  mount() {
    this.container.innerHTML = `
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

    var $ = document.querySelector.bind(document);
    this.messageEl = $('#message');
    this.sentenceEl = $('#sentence');

    let el = document.querySelector('#record-screen');
    this.recordButtonEl = el.querySelector('#recordButton') as HTMLButtonElement;
    this.playButtonEl = el.querySelector('#playButton') as HTMLButtonElement;
    this.uploadButtonEl = el.querySelector('#uploadButton') as HTMLButtonElement;
    this.nextButtonEl = el.querySelector('#nextButton') as HTMLButtonElement;
    this.elapsedTimeEl = el.querySelector('#elapsedTime') as HTMLDivElement;
    this.playerEl = el.querySelector('#player') as HTMLMediaElement;

    this.recordButtonEl.addEventListener('click', this.onRecordClick.bind(this));
    this.uploadButtonEl.addEventListener('click', this.onUploadClick.bind(this));
    this.playButtonEl.addEventListener('click', this.onPlayClick.bind(this));
    this.nextButtonEl.addEventListener('click', this.onNextClick.bind(this));

    // var levels = el.querySelector('#levels') as HTMLCanvasElement;
    var radialLevels = el.querySelector('#radialLevels') as HTMLCanvasElement;
    // var spectrogram = el.querySelector('#spectrogram') as HTMLCanvasElement;

    // this.visualizer = new LinearAnalyzerNodeView(this.audio.analyzerNode, levels, 384, 300);
    this.radialVisualizer = new RadialAnalyzerNodeView(this.audio.analyzerNode, radialLevels, 300, 300);
    // this.spectrogramVisualizer = new SpectogramAnalyzerNodeView(this.audio.analyzerNode, spectrogram, 500, 300);


    this.playerEl.addEventListener('canplaythrough', this.onCanPlayThrough.bind(this));
    this.playerEl.addEventListener('play', this.onPlay.bind(this));
    this.playerEl.addEventListener('ended', this.onPlayEnded.bind(this));
  }

  onRecordClick() {
    if (this.state.recording) {
      this.stopRecording();
    } else {
      this.startRecording();
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
    let self = this;
    let upload = new Promise(function (resolve, reject) {
      var req = new XMLHttpRequest();
      req.upload.addEventListener('load', resolve);
      req.upload.addEventListener("error", reject);
      req.open('POST', SOUNDCLIP_URL);
      req.setRequestHeader('uid', getUserId());
      req.setRequestHeader('sentence', encodeURIComponent(self.state.sentence));
      req.send(self.audio.lastRecording);
    });

    upload.then(function() {
      console.log("Uploaded Ok.");
    }).catch(function(e) {
      console.log("Upload Error: " + ERR_UPLOAD_FAILED);
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
    this.sentenceEl.textContent = `${this.state.sentence}`;
    this.messageEl.textContent = this.state.message ? `${this.state.message}` : "N/A";
    this.recordButtonEl.textContent = this.state.recording ? 'Stop' : 'Record';
    this.playButtonEl.textContent = this.state.playing ? 'Stop' : 'Play';

    // this.visualizer.isRecording = this.state.recording;
    this.radialVisualizer.isRecording = this.state.recording;
    // this.spectrogramVisualizer.isRecording = this.state.recording;

    if (this.state.recording) {
      let elapsedTime = this.audio.audioContext.currentTime - this.state.recordingStartTime;
      // this.elapsedTimeEl.innerText = elapsedTime.toFixed(2);
    }

    this.recordButtonEl.classList.toggle('disabled', this.state.playing);
    this.playButtonEl.classList.toggle('disabled', this.state.recording || !this.audio.lastRecording);
    this.uploadButtonEl.classList.toggle('disabled', !this.audio.lastRecording || this.state.recording || this.state.playing);
    this.nextButtonEl.classList.toggle('disabled', this.state.recording || this.state.playing);
  }
}

export default function start() {
  Audio.getMicrophone().then((microphone) => {
    new RecordComponent(document.getElementById('content') as HTMLDivElement, microphone);
  });
}
