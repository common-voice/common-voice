import ERROR_MSG from '../../../error-msg';

export interface AudioInfo {
  url: string;
  blob: Blob;
}

export default class AudioWeb {
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
      (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ||
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia
    );
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

  private async init() {
    if (this.microphone) return;

    const audioContext = new AudioContext();

    this.microphone = await this.getMicrophone();
    const sourceNode = audioContext.createMediaStreamSource(this.microphone);

    this.processor = audioContext.createScriptProcessor(0, 1, 1);

    sourceNode.connect(this.processor);
    this.processor.connect(audioContext.destination);

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

  setVolumeCallback(cb: Function) {
    this.volumeCallback = cb;
  }

  async start() {
    await this.init();

    this.processor.onaudioprocess = (event: AudioProcessingEvent) => {
      this.worker.postMessage({
        cmd: 'encode',
        buf: event.inputBuffer.getChannelData(0),
      });
    };

    this.jsNode.onaudioprocess = this.visualize;
  }

  async stop(): Promise<AudioInfo | {}> {
    if (!this.microphone) return;

    this.microphone.stop();
    this.microphone = null;

    return new Promise(resolve => {
      this.onResult = (blob: any) =>
        resolve({
          url: URL.createObjectURL(blob),
          blob,
        });
      this.worker.postMessage({ cmd: 'finish' });
      this.volumeCallback && this.volumeCallback(100);
      this.processor.onaudioprocess = null;
      this.jsNode.onaudioprocess = null;
    });
  }
}
