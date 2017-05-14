declare var MediaRecorder: any;

import ERROR_MSG from '../../../error-msg';

export default class Audio {
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
      function deny() { reject(ERROR_MSG.ERR_NO_MIC); }

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
        reject(ERROR_MSG.ERR_PLATFORM);  // Browser does not support getUserMedia
      }
    });
  }
}

