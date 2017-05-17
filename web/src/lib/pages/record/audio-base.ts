/**
 * Audio helper for dealing with microphone and sound data.
 */
export default abstract class AudioBase {
  static AUDIO_TYPE: string = 'audio/ogg; codecs=opus';
  lastRecording: Blob;
  constructor(public container: HTMLElement) {}
  abstract init(): Promise<any>;
  abstract start(): Promise<any>;
  abstract stop(): Promise<any>;
}

