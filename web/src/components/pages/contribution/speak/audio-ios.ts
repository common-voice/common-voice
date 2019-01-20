import { isNativeIOS } from '../../../../utility';
import { AudioInfo } from './audio-web';
import confirm from '../../../../confirm/confirm';

const LEVELS_THROTTLE = 50;

declare var webkit: any;
declare var vcopensettings: any;

export default class AudioIOS {
  postMessage: Function;
  pendingStart: Function;
  pendingStartError: Function;
  volumeCallback: Function;
  lastUpdate: number;

  static AUDIO_TYPE: string = 'audio/m4a;base64';
  last: AudioInfo;

  clear(): void {
    this.last = null;
  }

  // Microphone is definitely supported on iOS.
  isMicrophoneSupported() {
    return true;
  }

  isAudioRecordingSupported() {
    return true;
  }

  // For audio src URL, we need to trick webkit into
  // thinking this is an mp4 base64 encoding.
  static AUDIO_TYPE_URL: string = 'audio/mp4;base64';

  private handleNativeMessage(msg: string): void {
    if (msg === 'nomicpermission') {
      confirm(
        'Please allow microphone access to record your voice.',
        'Go to Settings',
        'Cancel'
      ).then(gotoSettings => {
        if (gotoSettings) {
          vcopensettings();
        }
      });
    } else if (msg === 'capturestarted') {
      if (this.pendingStart) {
        let cb = this.pendingStart;
        this.pendingStart = null;
        this.pendingStartError = null;
        cb();
      }
    } else if (msg === 'errorrecording') {
      if (this.pendingStart) {
        let cb = this.pendingStartError;
        this.pendingStart = null;
        this.pendingStartError = null;
        cb('Unable to start recording');
      }
    } else {
      console.log('unhandled native message', msg);
    }
  }

  constructor() {
    // Make sure we are in the right context before we allow instantiation.
    if (!isNativeIOS()) {
      throw new Error('cannot use ios audio in web app');
    }

    // Native will call this function with decibels from -120 to 0.
    this.lastUpdate = Date.now();
    window['levels'] = (decibels: string) => {
      if (!this.volumeCallback) {
        return;
      }

      let now = Date.now();
      if (now - this.lastUpdate > LEVELS_THROTTLE) {
        this.lastUpdate = now;
        // Scale and shift to get a nice sound curve.
        let volume = (parseInt(decibels, 10) + 70) * 1.5;
        this.volumeCallback(volume);
      }
    };

    // Handle any messages coming from native.
    window['nativemsgs'] = this.handleNativeMessage.bind(this);

    // Store our native message bridge for later.
    let messenger = webkit.messageHandlers['scriptHandler'];
    this.postMessage = messenger.postMessage.bind(messenger);

    // For now, we will always use portrait mode for the app.
    this.postMessage('lockportrait');
  }

  /**
   * Initialize the recorder. For this iOS implementation, this is a no-op.
   *
   * @returns A Promise that resolves to `true` immediately.
   */
  async init(): Promise<boolean> {
    return true;
  }

  setVolumeCallback(cb: Function) {
    this.volumeCallback = cb;
  }

  start(): Promise<void> {
    return new Promise<void>((res, rej) => {
      this.pendingStart = res;
      this.pendingStartError = rej;
      this.postMessage('startCapture');
    });
  }

  stop(): Promise<AudioInfo> {
    return new Promise((res: Function, rej: Function) => {
      // Liten for the next data call from Native, that will
      // have our sound data in base64 format.

      window['uploadData'] = (data: string) => {
        this.last = {
          url: 'data:' + AudioIOS.AUDIO_TYPE_URL + ',' + data,
          blob: new Blob([data], {
            type: AudioIOS.AUDIO_TYPE,
          }),
        };
        res(this.last);
      };

      this.postMessage('stopCapture');
    });
  }

  release() {}

  // We aren't using this for now, but this performs better
  // than the base64 url for obvious reasons.
  play(): void {
    this.postMessage('playCapture');
  }
}
