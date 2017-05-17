import AudioBase from 'audio-base';
import ERROR_MSG from '../../../error-msg';
import { isNativeIOS } from '../../utility';

export default class AudioIOS extends AudioBase {
  constructor(container: HTMLElement) {
    super(container);
    // Make sure we are in the right context before we allow instantiation.
    if (isNativeIOS()) {
      throw new Error('cannot use ios audio in web app');
    }
  }

  init() {
    // iOS handles all the audio init for us, so we do nothing here.
    return Promise.resolve();
  }

  // TODO: implement me.
  start() {
    return Promise.reject('Unimplemented');
  }

  // TODO: implement me.
  stop() {
    return Promise.reject('Unimplemented');
  }
}
