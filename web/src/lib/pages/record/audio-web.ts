import AudioBase from 'audio-base';
import ERROR_MSG from '../../../error-msg';
import { AnalyzerNodeView, RadialAnalyzerNodeView } from '../../viz';
import { isNativeIOS } from '../../utility';

export default class AudioWeb extends AudioBase {
  ready: boolean;
  lastRecording: Blob;
  microphone: MediaStream;
  analyzerNode: AnalyserNode;
  audioContext: AudioContext;
  radialVisualizer: AnalyzerNodeView;
  recorder: any;
  chunks: any[];

  constructor(container: HTMLElement) {
    super(container);

    // Make sure we are in the right context before we allow instantiation.
    if (isNativeIOS()) {
      throw new Error('cannot use web audio in iOS app');
    }

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

  private showViz() {
    if (this.radialVisualizer) {
      return;
    }

    let vizContainer = document.createElement('div');
    let levels = document.createElement('canvas');
    levels.id = 'levels';
    levels.height = levels.width = 100;
    vizContainer.appendChild(levels);
    this.container.appendChild(vizContainer);

    this.radialVisualizer =
      new RadialAnalyzerNodeView(this.analyzerNode, levels, 300, 300);
  }


  init() {
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

      this.showViz();

      this.ready = true;
    });
  }

  start() {
    if (!this.ready) {
      console.error('Cannot record audio before microhphone is ready.');
      return Promise.resolve();;
    }

    return new Promise((res: Function, rej: Function) => {
      this.chunks = [];
      this.recorder.ondataavailable = (e) => {
        this.chunks.push(e.data);
      };

      this.recorder.onstart = (e) => {
        this.radialVisualizer.isRecording = true;
        this.lastRecording = null;
        res();
      }

      // We want to be able to record up to 60s of audio in a single blob.
      // Without this argument to start(), Chrome will call dataavailable
      // very frequently.
      this.recorder.start(20000);
    });
  }

  stop() {
    if (!this.ready) {
      console.error('Cannot stop audio before microhphone is ready.');
      return Promise.resolve();;
    }

    return new Promise((res: Function, rej: Function) => {
      this.recorder.onstop = (e) => {
        this.radialVisualizer.isRecording = false;
        var blob = new Blob(this.chunks, { 'type': AudioBase.AUDIO_TYPE });
        this.lastRecording = blob;
        res(blob);
      };
      this.recorder.stop();
    });
  }
}

