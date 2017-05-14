/*
 * Error strings.
 */
export default class ERROR_MSG {
  static ERR_NO_RECORDING: string = "Please record first.";
  static ERR_NO_PLAYBACK: string = "Please listen before submitting.";
  static ERR_PLATFORM: string = "Your browser does not support audio recording.";
  static ERR_NO_CONSENT: string = "You did not consent to recording. You must click the \"I Agree\" button in order to use this website.";
  static ERR_NO_MIC: string = "You did not allow this website to use the microphone. The website needs the microphone to record your voice.";
  static ERR_UPLOAD_FAILED: string = "Uploading your recording to the server failed. This may be a temporary problem. Please try again.";
  static ERR_DATA_FAILED: string = "Submitting your profile data failed. This may be a temporary problem. Please try again.";
}

