import ERROR_MSG from '../../../../error-msg';
import { isNativeIOS } from '../../../utility';
import confirm from '../../../confirm/confirm';

const AUDIO_TYPE = 'audio/ogg; codecs=opus';

interface BlobEvent extends Event {
  data: Blob;
}

export interface AudioInfo {
  url: string;
  blob: Blob;
}

export default class AudioWeb {
  ready: boolean;
  microphone: MediaStream;
  analyzerNode: AnalyserNode;
  audioContext: AudioContext;
  recorder: any;
  chunks: any[];
  last: AudioInfo;
  lastRecordingData: Blob;
  lastRecordingUrl: string;
  initPromise: Promise<void>;
  frequencyBins: Uint8Array;
  volumeCallback: Function;
  jsNode: any;

  constructor() {
    // Make sure we are in the right context before we allow instantiation.
    if (isNativeIOS()) {
      throw new Error('cannot use web audio in iOS app');
    }

    this.visualize = this.visualize.bind(this);

    this.ready = false;
  }

  private getMicrophone(): Promise<MediaStream> {
    return new Promise(function(res: Function, rej: Function) {
      // Reject the promise with a 'permission denied' error code
      function deny() {
        rej(ERROR_MSG.ERR_NO_MIC);
      }
      function resolve(stream: MediaStream) {
        res(stream);
      }

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(resolve, deny);
      } else if (navigator.getUserMedia) {
        navigator.getUserMedia({ audio: true }, resolve, deny);
      } else if (navigator.webkitGetUserMedia) {
        navigator.webkitGetUserMedia({ audio: true }, resolve, deny);
      } else if (navigator.mozGetUserMedia) {
        navigator.mozGetUserMedia({ audio: true }, resolve, deny);
      } else {
        // Browser does not support getUserMedia
        rej(ERROR_MSG.ERR_PLATFORM);
      }
    });
  }

  // Check all the browser prefixes for microhpone support.
  isMicrophoneSupported() {
    return (
      (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ||
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia
    );
  }

  // Check if audio recording is supported
  isAudioRecordingSupported() {
    return typeof MediaRecorder !== 'undefined';
  }

  private visualize() {
    this.analyzerNode.getByteFrequencyData(this.frequencyBins);

    let sum = 0;
    for (var i = 0; i < this.frequencyBins.length; i++) {
      sum += this.frequencyBins[i];
    }

    let average = sum / this.frequencyBins.length;

    if (this.volumeCallback) {
      this.volumeCallback(average);
    }
  }

  private startVisualize() {
    this.jsNode.onaudioprocess = this.visualize;
  }

  private stopVisualize() {
    this.jsNode.onaudioprocess = undefined;
    if (this.volumeCallback) {
      this.volumeCallback(100);
    }
  }

  setVolumeCallback(cb: Function) {
    this.volumeCallback = cb;
  }

  init(): Promise<void> {
    if (!this.initPromise) {
      this.initPromise = this.doInit();
    }

    return this.initPromise;
  }

  private async doInit(): Promise<void> {
    try {
      const microphone = await this.getMicrophone();

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
      analyzerNode.smoothingTimeConstant = 0.96;
      this.frequencyBins = new Uint8Array(analyzerNode.frequencyBinCount);

      // Setup audio visualizer.
      this.jsNode = audioContext.createScriptProcessor(256, 1, 1);
      this.jsNode.connect(audioContext.destination);

      // Another audio node used by the beep() function
      var beeperVolume = audioContext.createGain();
      beeperVolume.connect(audioContext.destination);

      this.analyzerNode = analyzerNode;
      this.audioContext = audioContext;

      this.ready = true;
    } catch (err) {
      if (err === ERROR_MSG.ERR_NO_MIC) {
        const shouldRetry = await confirm(
          'You must allow microphone access.',
          'Retry',
          'Cancel'
        );
        window.location.reload();
      } else {
        throw err;
      }
    }
  }

  start(): Promise<void> {
    if (!this.ready) {
      console.error('Cannot record audio before microhphone is ready.');
      return Promise.resolve();
    }

    return new Promise<void>((res: Function, rej: Function) => {
      this.chunks = [];
      this.recorder.ondataavailable = (e: BlobEvent) => {
        this.chunks.push(e.data);
      };

      this.recorder.onstart = (e: Event) => {
        this.clear();
        res();
      };

      // We want to be able to record up to 60s of audio in a single blob.
      // Without this argument to start(), Chrome will call dataavailable
      // very frequently.
      this.startVisualize();
      this.recorder.start(20000);
    });
  }

  stop(): Promise<AudioInfo | {}> {
    if (!this.ready) {
      console.error('Cannot stop audio before microhphone is ready.');
      return Promise.resolve({});
    }

    return new Promise((res: Function, rej: Function) => {
      this.stopVisualize();

      this.recorder.onstop = (e: Event) => {
        let blob = new Blob(this.chunks, { type: AUDIO_TYPE });
        this.last = {
          url: URL.createObjectURL(blob),
          blob: blob,
        };
        res(this.last);
      };
      this.recorder.stop();
    });
  }

  clear() {
    if (this.lastRecordingUrl) {
      URL.revokeObjectURL(this.lastRecordingUrl);
    }

    this.lastRecordingData = null;
    this.lastRecordingUrl = null;
  }
}
