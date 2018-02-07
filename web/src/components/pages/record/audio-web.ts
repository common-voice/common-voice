import ERROR_MSG from '../../../error-msg';

const MIN_RECORD_MS = 1000; // Safari will start misbehaving if we do

export interface AudioInfo {
  url: string;
  blob: Blob;
}

const AudioContext = window.AudioContext || window.webkitAudioContext;

export default class AudioWeb {
  startPromise: Promise<void>;
  startedAt: number;
  stopPromise: Promise<AudioInfo | {}>;
  worker: Worker;
  microphone: MediaStream;
  analyzerNode: AnalyserNode;
  frequencyBins: Uint8Array;
  volumeCallback: Function;
  processor: ScriptProcessorNode;
  jsNode: ScriptProcessorNode;
  onResult: Function;

  constructor() {
    this.worker = new Worker('encode-mp3-worker.js');
    this.worker.onmessage = ({ data }) => {
      switch (data.cmd) {
        case 'end':
          this.onResult &&
            this.onResult(new Blob(data.buf, { type: 'audio/mpeg' }));
          break;
        case 'error':
          console.error(data.error);
          break;
      }
    };
    this.worker.postMessage({ cmd: 'init', config: {} });
  }

  private getMicrophone(): Promise<MediaStream> {
    return new Promise(function(
      resolve: (stream: MediaStream) => any,
      reject: Function
    ) {
      function deny() {
        reject(ERROR_MSG.ERR_NO_MIC);
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
        reject(ERROR_MSG.ERR_PLATFORM);
      }
    });
  }

  isMicrophoneSupported() {
    return (
      AudioContext &&
      ((navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ||
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia)
    );
  }

  private visualize = () => {
    this.analyzerNode.getByteFrequencyData(this.frequencyBins);

    const sum = this.frequencyBins.reduce((sum, n) => sum + n, 0);

    if (this.volumeCallback) {
      this.volumeCallback(sum / this.frequencyBins.length);
    }
  };

  private async init() {
    if (this.microphone) return;

    const audioContext = new AudioContext();

    this.microphone = await this.getMicrophone();

    this.processor = audioContext.createScriptProcessor(0, 1, 1);
    const sourceNode = audioContext.createMediaStreamSource(this.microphone);
    sourceNode.connect(this.processor);
    sourceNode.channelCount = 1;
    this.processor.connect(audioContext.destination);

    if (!audioContext.createMediaStreamDestination) return;

    const volumeNode = audioContext.createGain();
    const analyzerNode = audioContext.createAnalyser();
    const outputNode = audioContext.createMediaStreamDestination();

    // Make sure we're doing mono everywhere.
    volumeNode.channelCount = 1;
    analyzerNode.channelCount = 1;
    outputNode.channelCount = 1;

    // Connect the nodes together
    sourceNode.connect(volumeNode);
    volumeNode.connect(analyzerNode);
    analyzerNode.connect(outputNode);

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

    this.analyzerNode = analyzerNode;
  }

  setVolumeCallback(cb: Function) {
    this.volumeCallback = cb;
  }

  start = () =>
    this.startPromise ||
    (this.startPromise = new Promise(async resolve => {
      await this.init();

      this.startedAt = Date.now();
      this.processor.onaudioprocess = (event: AudioProcessingEvent) => {
        this.worker.postMessage({
          cmd: 'encode',
          buf: event.inputBuffer.getChannelData(0),
        });
      };

      if (this.jsNode) this.jsNode.onaudioprocess = this.visualize;

      this.startPromise = null;
      resolve();
    }));

  stop = () =>
    this.stopPromise ||
    (this.stopPromise = new Promise(async resolve => {
      if (!this.microphone) resolve({});

      await new Promise(resolve =>
        setTimeout(resolve, this.startedAt - Date.now() + MIN_RECORD_MS)
      );
      this.onResult = (blob: any) => {
        this.stopPromise = null;
        resolve({
          url: URL.createObjectURL(blob),
          blob,
        });
      };
      this.worker.postMessage({ cmd: 'finish' });
      this.volumeCallback && this.volumeCallback(100);
      this.processor.onaudioprocess = null;
      if (this.jsNode) this.jsNode.onaudioprocess = null;
    }));

  release() {
    for (const track of this.microphone.getTracks()) {
      track.stop();
    }
    this.microphone = null;
  }
}
