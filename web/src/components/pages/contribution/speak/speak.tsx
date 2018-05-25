import debounce = require('lodash.debounce');
import { Localized } from 'fluent-react';
import * as React from 'react';
import { connect } from 'react-redux';
import ERROR_MSG from '../../../../error-msg';
import { Recordings } from '../../../../stores/recordings';
import StateTree from '../../../../stores/tree';
import { User } from '../../../../stores/user';
import API from '../../../../services/api';
import { trackRecording } from '../../../../services/tracker';
import {
  FontIcon,
  MicIcon,
  PlayIcon,
  RedoIcon,
  ShareIcon,
} from '../../../ui/icons';
import { getItunesURL, isFirefoxFocus, isNativeIOS } from '../../../../utility';
import AudioIOS from '../../record/audio-ios';
import AudioWeb, { AudioInfo } from '../../record/audio-web';
import ContributionPage, {
  ContributionPillProps,
  SET_COUNT,
} from '../contribution';
import { RecordButton, StopButton } from '../primary-buttons';
import RecordingPill from './recording-pill';

import './speak.css';

const MIN_RECORDING_MS = 300;
const MAX_RECORDING_MS = 10000;
const MIN_VOLUME = 1;
const RECORD_DEBOUNCE_MS = 300;

enum RecordingError {
  TOO_SHORT = 1,
  TOO_LONG,
  TOO_QUIET,
}

const UnsupportedInfo = () => (
  <div className="unsupported">
    <Localized id="record-platform-not-supported">
      <h2 />
    </Localized>
    <p key="desktop">
      <Localized id="record-platform-not-supported-desktop">
        <span />
      </Localized>
      <a target="_blank" href="https://www.firefox.com/">
        <FontIcon type="firefox" />Firefox
      </a>{' '}
      <a target="_blank" href="https://www.google.com/chrome">
        <FontIcon type="chrome" />Chrome
      </a>
    </p>
    <p key="ios">
      <Localized id="record-platform-not-supported-ios" bold={<b />}>
        <span />
      </Localized>
    </p>
    <a target="_blank" href={getItunesURL()}>
      <img src="/img/appstore.svg" />
    </a>
  </div>
);

// Without wrapping fluent adds children, which React doesn't like for imgs
const MicIconWrap = () => <MicIcon />;

interface PropsFromState {
  api: API;
  sentences: Recordings.Sentence[];
}

interface PropsFromDispatch {
  removeSentences: typeof Recordings.actions.removeSentences;
  tallyRecording: typeof User.actions.tallyRecording;
}

interface Props extends PropsFromState, PropsFromDispatch {}

interface State {
  isRecording: boolean;
  recordingError?: RecordingError;
  clips: (Recordings.SentenceRecording)[];
}

class SpeakPage extends React.Component<Props, State> {
  state: State = {
    isRecording: false,
    recordingError: null,
    clips: [],
  };

  audio: AudioWeb | AudioIOS;
  isUnsupportedPlatform = false;
  maxVolume = 0;
  recordingStartTime = 0;
  recordingStopTime = 0;

  static getDerivedStateFromProps(props: Props, state: State) {
    if (state.clips.length > 0) return null;

    if (props.sentences.length > 0) {
      return {
        clips: props.sentences
          .slice(0, SET_COUNT)
          .map(sentence => ({ recording: null, sentence })),
      };
    }

    return null;
  }

  componentDidMount() {
    this.audio = isNativeIOS() ? new AudioIOS() : new AudioWeb();
    this.audio.setVolumeCallback(this.updateVolume.bind(this));

    document.addEventListener('visibilitychange', this.releaseMicrophone);

    if (
      !this.audio.isMicrophoneSupported() ||
      !this.audio.isAudioRecordingSupported() ||
      isFirefoxFocus()
    ) {
      this.isUnsupportedPlatform = true;
    }
  }

  componentWillUnmount() {
    document.removeEventListener('visibilitychange', this.releaseMicrophone);
  }

  private getRecordingIndex() {
    return this.state.clips.findIndex(({ recording }) => !recording);
  }

  private releaseMicrophone = () => {
    if (!document.hidden) {
      return;
    }

    if (this.state.isRecording) {
      this.stopRecording();
    }
    this.audio.release();
  };

  private processRecording = (info: AudioInfo) => {
    const recordingError = this.getRecordingError();
    if (recordingError) {
      return this.setState({ recordingError });
    }

    const { clips } = this.state;
    this.setState({
      // this.props.reRecordSentenceId
      clips: clips.map(({ recording, sentence }, i) => ({
        recording: i === this.getRecordingIndex() ? info : recording,
        sentence,
      })),
    });

    setTimeout(() => {
      this.setState({
        // showSubmitSuccess: this.props.isSetFull,
      });
    });

    trackRecording('record');
  };

  private getRecordingError = (): RecordingError => {
    const length = this.recordingStopTime - this.recordingStartTime;
    if (length < MIN_RECORDING_MS) {
      return RecordingError.TOO_SHORT;
    }
    if (length > MAX_RECORDING_MS) {
      return RecordingError.TOO_LONG;
    }
    if (this.maxVolume < MIN_VOLUME) {
      return RecordingError.TOO_QUIET;
    }
    return null;
  };

  private updateVolume = (volume: number) => {
    // For some reason, volume is always exactly 100 at the end of the
    // recording, even if it is silent; so ignore that.
    if (volume !== 100 && volume > this.maxVolume) {
      this.maxVolume = volume;
    }
  };

  // private rerecord = async () => {
  //   const { recordingsCount, sentenceRecordings } = this.props;
  //
  //   if (recordingsCount < 1) {
  //     console.error('cannot undo, no recordings');
  //     return;
  //   }
  //
  //   // If user was recording when going back, make sure to throw
  //   // out this new recording too.
  //   if (this.state.isRecording) {
  //     this.stopRecordingHard();
  //   }
  //
  //   this.props.setRecording(
  //     Object.keys(sentenceRecordings)[recordingsCount - 1],
  //     null
  //   );
  //   this.setState({
  //     showSubmitSuccess: false,
  //   });
  // };

  private handleRecordClick = debounce(async () => {
    if (this.state.isRecording) {
      this.stopRecording();
      return;
    }

    try {
      await this.audio.init();
      await this.startRecording();
    } catch (err) {
      if (err === ERROR_MSG.ERR_NO_MIC) {
        // this.setState({ showRetryModal: true });
      } else {
        throw err;
      }
    }
  }, RECORD_DEBOUNCE_MS);

  private startRecording = async () => {
    await this.audio.start();
    this.maxVolume = 0;
    this.recordingStartTime = Date.now();
    this.recordingStopTime = 0;
    this.setState({
      // showSubmitSuccess: false,
      isRecording: true,
      recordingError: null,
    });
  };

  private stopRecording = () => {
    this.audio.stop().then(this.processRecording);
    this.recordingStopTime = Date.now();
    this.setState({
      isRecording: false,
    });
  };

  private stopRecordingHard = async () => {
    await this.audio.stop();
    this.setState({ isRecording: false });
  };

  private closeSubmitSuccess = () => {
    this.setState({
      // showSubmitSuccess: false,
    });
  };

  private clearRecordingError = () => {
    this.setState({ recordingError: null });
  };

  private cancelReRecord = async () => {
    await this.stopRecordingHard();
  };

  private handleSkip = () => {};

  private handleSubmit = async () => {
    // await this.ensurePrivacyAgreement();

    const { api, tallyRecording } = this.props;
    const { clips } = this.state;

    for (const { sentence, recording } of clips) {
      await api.uploadClip(recording.blob, sentence.id, sentence.text);

      tallyRecording();
    }
    await api.syncDemographics();
    trackRecording('submit');
  };

  render() {
    const { isRecording, recordingError, clips } = this.state;
    const recordingIndex = this.getRecordingIndex();
    return (
      <ContributionPage
        activeIndex={recordingIndex}
        className="speak"
        errorContent={this.isUnsupportedPlatform && <UnsupportedInfo />}
        Instruction={props =>
          recordingError ? (
            <Localized
              id={
                'record-error-' +
                {
                  [RecordingError.TOO_SHORT]: 'too-short',
                  [RecordingError.TOO_LONG]: 'too-long',
                  [RecordingError.TOO_QUIET]: 'too-quiet',
                }[recordingError]
              }
            />
          ) : (
            <Localized
              id="record-instruction"
              recordIcon={<MicIconWrap />}
              {...props}
            />
          )
        }
        onSkip={this.handleSkip}
        onSubmit={this.handleSubmit}
        primaryButtons={
          isRecording ? (
            <StopButton onClick={this.handleRecordClick} />
          ) : (
            <RecordButton onClick={this.handleRecordClick} />
          )
        }
        pills={clips.map((clip, i) => (props: ContributionPillProps) => (
          <RecordingPill
            {...props}
            clip={clip}
            status={
              recordingIndex === i
                ? 'active'
                : clip.recording ? 'done' : 'pending'
            }
          />
        ))}
        sentences={clips.map(({ sentence: { text } }) => text)}
      />
    );
  }
}

const mapStateToProps = (state: StateTree) => {
  return {
    api: state.api,
    sentences: Recordings.selectors.localeRecordings(state).sentences,
  };
};

const mapDispatchToProps = {
  removeSentences: Recordings.actions.removeSentences,
  tallyRecording: User.actions.tallyRecording,
};

export default connect<PropsFromState, PropsFromDispatch>(
  mapStateToProps,
  mapDispatchToProps
)(SpeakPage);
