import AudioBase from 'audio-base';
import ERROR_MSG from '../../../error-msg';
import { isNativeIOS } from '../../utility';

export default class AudioIOS extends AudioBase {
  postMessage: Function;

  constructor(container: HTMLElement) {
    super(container);
    // Make sure we are in the right context before we allow instantiation.
    if (!isNativeIOS()) {
      throw new Error('cannot use ios audio in web app');
    }

    // Store our native message bridge for later.
    let messenger = webkit.messageHandlers['scriptHandler'];
    this.postMessage = messenger.postMessage.bind(messenger);
  }

  private handleAudioFromNative(data: any) {
    console.log('got data!', data);
  }

  init() {
    window['uploadData'] = this.handleAudioFromNative.bind(this);
    return Promise.resolve();
  }

  start() {
    this.postMessage('startCapture');
    return Promise.resolve();
  }

  stop() {
    this.postMessage('stopCapture');
    return Promise.resolve();
  }
}
