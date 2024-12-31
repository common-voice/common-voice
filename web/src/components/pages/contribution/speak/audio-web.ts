import { getAudioFormat } from '../../../../utility';

interface BlobEvent extends Event {
  data: Blob;
}

export enum AudioError {
  NOT_ALLOWED = 'NOT_ALLOWED',
  NO_MIC = 'NO_MIC',
  NO_SUPPORT = 'NO_SUPPORT',
}

export interface AudioInfo {
  url: string;
  blob: Blob;
}

export default class AudioWeb {
  microphone: MediaStream;
  analyzerNode: AnalyserNode;
  audioContext: AudioContext;
  recorder: any;
  chunks: any[];
  frequencyBins: Uint8Array;
  volumeCallback: Function;
  jsNode: any;
  recorderListeners: {
    start: Function | null;
    dataavailable: Function | null;
    stop: Function | null;
  };

  constructor() {
    this.recorderListeners = {
      start: null,
      dataavailable: null,
      stop: null,
    };
    this.analyze = this.analyze.bind(this);
  }

  private isReady(): boolean {
    return !!this.microphone;
  }

  private getMicrophone(): Promise<MediaStream> {
    return new Promise(function (res: Function, rej: Function) {
      function deny(error: DOMException) {
        rej(
          (
            {
              NotAllowedError: AudioError.NOT_ALLOWED,
              NotFoundError: AudioError.NO_MIC,
            } as { [errorName: string]: AudioError }
          )[error.name] || error
        );
      }
      function resolve(stream: MediaStream) {
        res(stream);
      }

      if (navigator.mediaDevices?.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(resolve, deny);
      } else if (navigator.webkitGetUserMedia) {
        navigator.webkitGetUserMedia({ audio: true }, resolve, deny);
      } else if (navigator.mozGetUserMedia) {
        navigator.mozGetUserMedia({ audio: true }, resolve, deny);
      } else {
        // Browser does not support getUserMedia
        rej(AudioError.NO_SUPPORT);
      }
    });
  }

  // Check all the browser prefixes for microhpone support.
  isMicrophoneSupported() {
    return (
      navigator.mediaDevices?.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia
    );
  }

  // Check if audio recording is supported
  isAudioRecordingSupported() {
    const supportedFormats = [
      'audio/webm', // For Chrome
      'audio/ogg; codecs=opus', // For Firefox
      'audio/mp4', // For Safari
    ];

    // check if at least one of the formats is supported in the browser
    const isAudioFormatSupported = supportedFormats.some(format =>
      window.MediaRecorder.isTypeSupported(format)
    );

    return (
      typeof window.MediaRecorder !== 'undefined' && isAudioFormatSupported
    );
  }

  private analyze() {
    this.analyzerNode.getByteFrequencyData(this.frequencyBins);

    if (this.volumeCallback) {
      this.volumeCallback(Math.max(...this.frequencyBins));
    }
  }

  setVolumeCallback(cb: Function) {
    this.volumeCallback = cb;
  }

  /**
   * Initialize the recorder, opening the microphone media stream.
   *
   * If microphone access is currently denied, the user is asked to grant
   * access. Since these permission changes take effect only after a reload,
   * the page is reloaded if the user decides to do so.
   *
   */
  async init() {
    if (this.isReady()) {
      return;
    }

    const microphone = await this.getMicrophone();

    this.microphone = microphone;
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const sourceNode = audioContext.createMediaStreamSource(microphone);
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

    // and set up the recorder.
    this.recorder = new window.MediaRecorder(outputNode.stream);

    // Set up the analyzer node, and allocate an array for its data
    // FFT size 64 gives us 32 bins. But those bins hold frequencies up to
    // 22kHz or more, and we only care about lower frequencies which is where
    // most human voice lies, so we use fewer bins.
    analyzerNode.fftSize = 128;
    analyzerNode.smoothingTimeConstant = 0.96;
    this.frequencyBins = new Uint8Array(analyzerNode.frequencyBinCount);

    // Setup jsNode for audio analysis callbacks.
    // TODO: `createScriptProcessor` is deprecated, and is a heavy solution for
    //       what it’s doing (checking recording volume). It should be replaced
    //       with something lighter, or AudioWorklets once they become more
    //       widely adopted.
    this.jsNode = audioContext.createScriptProcessor(256, 1, 1);
    this.jsNode.connect(audioContext.destination);

    this.analyzerNode = analyzerNode;
    this.audioContext = audioContext;
  }

  start(): Promise<void> {
    if (!this.isReady()) {
      console.error('Cannot record audio before microhphone is ready.');
      return Promise.resolve();
    }

    return new Promise<void>((res: Function, rej: Function) => {
      this.chunks = [];
      // Remove the old listeners.
      this.recorder.removeEventListener('start', this.recorderListeners.start);
      this.recorder.removeEventListener(
        'dataavailable',
        this.recorderListeners.dataavailable
      );

      // Update the stored listeners.
      this.recorderListeners.start = (e: Event) => res();
      this.recorderListeners.dataavailable = (e: BlobEvent) => {
        this.chunks.push(e.data);
      };

      // Add the new listeners.
      this.recorder.addEventListener('start', this.recorderListeners.start);
      this.recorder.addEventListener(
        'dataavailable',
        this.recorderListeners.dataavailable
      );

      // Finally, start it up.
      // We want to be able to record up to 60s of audio in a single blob.
      // Without this argument to start(), Chrome will call dataavailable
      // very frequently.
      this.jsNode.onaudioprocess = this.analyze;
      this.recorder.start(20000);
    });
  }

  stop(): Promise<AudioInfo> {
    if (!this.isReady()) {
      console.error('Cannot stop audio before microphone is ready.');
      return Promise.reject();
    }

    return new Promise((res: Function, rej: Function) => {
      this.jsNode.onaudioprocess = undefined;
      this.recorder.removeEventListener('stop', this.recorderListeners.stop);
      this.recorderListeners.stop = (e: Event) => {
        let blob = new Blob(this.chunks, { type: getAudioFormat() });
        res({
          url: URL.createObjectURL(blob),
          blob: blob,
        });
      };
      this.recorder.addEventListener('stop', this.recorderListeners.stop);
      this.recorder.stop();
    });
  }

  release() {
    if (this.microphone) {
      for (const track of this.microphone.getTracks()) {
        track.stop();
      }
    }
    this.microphone = null;
  }
}
