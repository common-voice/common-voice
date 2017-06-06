import ERROR_MSG from '../../../error-msg';
import { isNativeIOS } from '../../utility';

declare var webkit;

export default class AudioIOS {
  postMessage: Function;

  static AUDIO_TYPE: string = 'audio/m4a;base64';
  lastRecordingData: Blob;
  lastRecordingUrl: string;

  clear(): void {
    this.lastRecordingData = null;
    this.lastRecordingUrl = null;
  }

  // For audio src URL, we need to trick webkit into
  // thinking this is an mp4 base64 encoding.
  static AUDIO_TYPE_URL: string = 'audio/mp4;base64';

  constructor() {
    // Make sure we are in the right context before we allow instantiation.
    if (!isNativeIOS()) {
      throw new Error('cannot use ios audio in web app');
    }

    // Native will call this function with audio info,
    // but we are not yet interested.
    window['levels'] = () => {};

    // Store our native message bridge for later.
    let messenger = webkit.messageHandlers['scriptHandler'];
    this.postMessage = messenger.postMessage.bind(messenger);
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
        this.lastRecordingUrl = 'data:' + AudioIOS.AUDIO_TYPE_URL + ',' + data;
        this.lastRecordingData = new Blob([data], {
          type: AudioIOS.AUDIO_TYPE
        });
        res();
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
