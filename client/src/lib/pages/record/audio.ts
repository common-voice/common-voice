declare var MediaRecorder: any;

import ERROR_MSG from '../../../error-msg';

const AUDIO_TYPE = 'audio/ogg; codecs=opus';

export default class Audio {
  ready: boolean;
  lastRecording: Blob;
  microphone: MediaStream;
  analyzerNode: AnalyserNode;
  audioContext: AudioContext;
  recorder: any;
  chunks: any[];

  constructor() {
    this.ready = false;
  }

  private getMicrophone(): Promise<MediaStream> {
    return new Promise(function (res: Function, rej: Function) {
      // Reject the promise with a 'permission denied' error code
      function deny() { rej(ERROR_MSG.ERR_NO_MIC); }
      function resolve(stream: MediaStream) { res(stream); }

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(resolve, deny);
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
        // Browser does not support getUserMedia
        rej(ERROR_MSG.ERR_PLATFORM);
      }
    });
  }

  init(): Promise<void> {
    if (this.ready) {
      return Promise.resolve();
    }

    return this.getMicrophone().then((microphone: MediaStream) => {
      this.microphone = microphone;
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

      this.ready = true;
    });
  }

  start() {
    if (!this.ready) {
      console.error('Cannot record audio before microhphone is ready.');
      return;
    }

    this.chunks = [];
    this.recorder.ondataavailable = (e) => {
      this.chunks.push(e.data);
    };

    // We want to be able to record up to 60s of audio in a single blob.
    // Without this argument to start(), Chrome will call dataavailable
    // very frequently.
    this.recorder.start(20000);
  }

  stop() {
    if (!this.ready) {
      console.error('Cannot stop audio before microhphone is ready.');
      return;
    }

    return new Promise((res: Function, reject: Function) => {
      this.recorder.onstop = (e) => {
        var blob = new Blob(this.chunks, { 'type': AUDIO_TYPE });
        this.lastRecording = blob;
        this.chunks = [];
        res(blob);
      };
      this.recorder.stop();
    });
  }

}

