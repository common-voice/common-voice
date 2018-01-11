import ERROR_MSG from '../../../error-msg';
const MicRecorder = require('mic-recorder-to-mp3');

export interface AudioInfo {
  url: string;
  blob: Blob;
}

export default class AudioWeb {
  analyzerNode: AnalyserNode;
  recorder: any;
  frequencyBins: Uint8Array;
  volumeCallback: Function;
  jsNode: any;

  private isReady(): boolean {
    return !!this.recorder;
  }

  isMicrophoneSupported() {
    return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
  }

  private visualize = () => {
    this.analyzerNode.getByteFrequencyData(this.frequencyBins);

    let sum = 0;
    for (let i = 0; i < this.frequencyBins.length; i++) {
      sum += this.frequencyBins[i];
    }

    let average = sum / this.frequencyBins.length;

    if (this.volumeCallback) {
      this.volumeCallback(average);
    }
  };

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

  async start() {
    this.recorder = this.recorder || new MicRecorder();
    const micStream = await this.recorder.start().catch(() => {
      throw ERROR_MSG.ERR_NO_MIC;
    });

    if (!this.analyzerNode) {
      const audioContext = new AudioContext();
      const sourceNode = audioContext.createMediaStreamSource(micStream);
      const volumeNode = audioContext.createGain();
      const analyzerNode = audioContext.createAnalyser();
      const outputNode = audioContext.createMediaStreamDestination();

      // Make sure we're doing mono everywhere.
      sourceNode.channelCount = 1;
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

    this.startVisualize();
  }

  async stop(): Promise<AudioInfo | {}> {
    if (!this.isReady()) {
      console.error('Cannot stop audio before microphone is ready.');
      return Promise.resolve({});
    }

    this.stopVisualize();

    const [, blob] = await this.recorder.stop().getMp3();
    return {
      url: URL.createObjectURL(blob),
      blob,
    };
  }
}
