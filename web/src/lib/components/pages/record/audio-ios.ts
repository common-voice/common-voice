import ERROR_MSG from '../../../../error-msg';
import { isNativeIOS } from '../../../utility';
import { AudioInfo } from './audio-web';
import confirm from '../../confirm';

declare var webkit;
declare var vcopensettings;

export default class AudioIOS {
  postMessage: Function;

  static AUDIO_TYPE: string = 'audio/m4a;base64';
  last: AudioInfo;

  clear(): void {
    this.last = null;
  }

  // For audio src URL, we need to trick webkit into
  // thinking this is an mp4 base64 encoding.
  static AUDIO_TYPE_URL: string = 'audio/mp4;base64';

  private handleNativeMessage(msg: string): void {
    if (msg === 'nomicpermission') {
      confirm('Please allow microphone access to record your voice.',
        'Go to Settings', 'Cancel').then((gotoSettings) => {
          if (gotoSettings) {
            vcopensettings();
          }
        });
    } else {
      console.log('unhandled native message', msg);
    }
  }

  constructor() {
    // Make sure we are in the right context before we allow instantiation.
    if (!isNativeIOS()) {
      throw new Error('cannot use ios audio in web app');
    }

    // Native will call this function with audio info,
    // but we are not yet interested.
    window['levels'] = () => {};

    // Handle any messages coming from native.
    window['nativemsgs'] = this.handleNativeMessage.bind(this);

    // Store our native message bridge for later.
    let messenger = webkit.messageHandlers['scriptHandler'];
    this.postMessage = messenger.postMessage.bind(messenger);

    // For now, we will always use portrait mode for the app.
    this.postMessage('lockportrait');
  }

  init() {
    return Promise.resolve();
  }

  start() {
    this.postMessage('startCapture');
    return Promise.resolve();
  }

  stop() {
    return new Promise((res: Function, rej: Function) => {
      // Liten for the next data call from Native, that will
      // have our sound data in base64 format.

      window['uploadData'] = (data: string) => {
        this.last = {
          url: 'data:' + AudioIOS.AUDIO_TYPE_URL + ',' + data,
          blob: new Blob([data], {
            type: AudioIOS.AUDIO_TYPE
          })
        };
        res(this.last);
      };

      this.postMessage('stopCapture');
    });
  }

  // We aren't using this for now, but this performs better
  // than the base64 url for obvious reasons.
  play(): void {
    this.postMessage("playCapture");
  }
}
