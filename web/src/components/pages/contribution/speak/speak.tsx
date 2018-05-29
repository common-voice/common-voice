import { Localized } from 'fluent-react';
import * as React from 'react';
import { connect } from 'react-redux';
import ERROR_MSG from '../../../../error-msg';
import { Recordings } from '../../../../stores/recordings';
import StateTree from '../../../../stores/tree';
import { User } from '../../../../stores/user';
import API from '../../../../services/api';
import { trackRecording } from '../../../../services/tracker';
import URLS from '../../../../urls';
import { LocaleLink } from '../../../locale-helpers';
import Modal from '../../../modal/modal';
import { CheckIcon, FontIcon, MicIcon, StopIcon } from '../../../ui/icons';
import { TextButton } from '../../../ui/ui';
import { getItunesURL, isFirefoxFocus, isNativeIOS } from '../../../../utility';
import AudioIOS from '../../record/audio-ios';
import AudioWeb, { AudioInfo } from '../../record/audio-web';
import ContributionPage, {
  ContributionPillProps,
  SET_COUNT,
} from '../contribution';
import { RecordButton, RecordingStatus } from '../primary-buttons';
import RecordingPill from './recording-pill';

import './speak.css';

const MIN_RECORDING_MS = 300;
const MAX_RECORDING_MS = 10000;
const MIN_VOLUME = 1;

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
  clips: (Recordings.SentenceRecording)[];
  isSubmitted: boolean;
  recordingError?: RecordingError;
  recordingStatus: RecordingStatus;
  rerecordIndex?: number;
}

class SpeakPage extends React.Component<Props, State> {
  state: State = {
    clips: [],
    isSubmitted: false,
    recordingError: null,
    recordingStatus: null,
    rerecordIndex: null,
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

  private get isRecording() {
    return this.state.recordingStatus === 'recording';
  }

  private getRecordingIndex() {
    const { rerecordIndex } = this.state;
    return rerecordIndex === null
      ? this.state.clips.findIndex(({ recording }) => !recording)
      : rerecordIndex;
  }

  private releaseMicrophone = () => {
    if (!document.hidden) {
      return;
    }

    if (this.isRecording) {
      this.saveRecording();
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
      clips: clips.map(({ recording, sentence }, i) => ({
        recording: i === this.getRecordingIndex() ? info : recording,
        sentence,
      })),
      rerecordIndex: null,
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

  private rerecord = async (i: number) => {
    await this.discardRecording();

    this.setState({
      rerecordIndex: i,
    });
  };

  private handleRecordClick = async () => {
    if (this.state.recordingStatus === 'waiting') return;
    this.setState({ recordingStatus: 'waiting' });

    if (this.isRecording) {
      this.saveRecording();
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
  };

  private startRecording = async () => {
    await this.audio.start();
    this.maxVolume = 0;
    this.recordingStartTime = Date.now();
    this.recordingStopTime = 0;
    this.setState({
      // showSubmitSuccess: false,
      recordingStatus: 'recording',
      recordingError: null,
    });
  };

  private saveRecording = () => {
    this.audio.stop().then(this.processRecording);
    this.recordingStopTime = Date.now();
    this.setState({
      recordingStatus: null,
    });
  };

  private discardRecording = async () => {
    if (!this.isRecording) return;
    await this.audio.stop();
    this.setState({ recordingStatus: null });
  };

  private cancelReRecord = async () => {
    await this.discardRecording();
    this.setState({ rerecordIndex: null });
  };

  private handleSkip = () => {
    const { removeSentences, sentences } = this.props;
    const { clips } = this.state;
    removeSentences([clips[this.getRecordingIndex()].sentence.id]);
    this.setState({
      clips: clips.map(
        (clip, i) =>
          this.getRecordingIndex() === i
            ? { recording: null, sentence: sentences.slice(SET_COUNT)[0] }
            : clip
      ),
    });
  };

  private handleSubmit = async () => {
    // await this.ensurePrivacyAgreement();

    const { api, removeSentences, tallyRecording } = this.props;
    const { clips } = this.state;

    this.setState({ clips: [], isSubmitted: true });

    for (const { sentence, recording } of clips) {
      await api.uploadClip(recording.blob, sentence.id, sentence.text);

      tallyRecording();
    }
    removeSentences(clips.map(c => c.sentence.id));
    await api.syncDemographics();
    trackRecording('submit');
  };

  render() {
    const {
      clips,
      isSubmitted,
      recordingError,
      recordingStatus,
      rerecordIndex,
    } = this.state;
    const recordingIndex = this.getRecordingIndex();
    return (
      <React.Fragment>
        <Modal>
          <Localized id="record-abort-title">
            <h1 />
          </Localized>
          <Localized id="record-abort-text">
            <p />
          </Localized>
        </Modal>
        <ContributionPage
          activeIndex={recordingIndex}
          errorContent={this.isUnsupportedPlatform && <UnsupportedInfo />}
          extraButton={
            rerecordIndex === null ? (
              <Localized id="unable-speak">
                <LocaleLink to={URLS.LISTEN} />
              </Localized>
            ) : (
              <Localized id="record-cancel">
                <TextButton onClick={this.cancelReRecord} />
              </Localized>
            )
          }
          instruction={props =>
            recordingError ? (
              <div className="error">
                <Localized
                  id={
                    'record-error-' +
                    {
                      [RecordingError.TOO_SHORT]: 'too-short',
                      [RecordingError.TOO_LONG]: 'too-long',
                      [RecordingError.TOO_QUIET]: 'too-quiet',
                    }[recordingError]
                  }
                  {...props}
                />
              </div>
            ) : (
              <Localized
                id={
                  this.isRecording
                    ? 'record-stop-instruction'
                    : recordingIndex === SET_COUNT - 1
                      ? 'record-last-instruction'
                      : ['record-instruction', 'record-again-instruction'][
                          recordingIndex
                        ] || 'record-again-instruction2'
                }
                checkIcon={<CheckIcon />}
                recordIcon={<MicIcon />}
                stopIcon={<StopIcon />}
                {...props}
              />
            )
          }
          isSubmitted={isSubmitted}
          onSkip={this.handleSkip}
          onSubmit={this.handleSubmit}
          primaryButtons={
            <RecordButton
              status={recordingStatus}
              onClick={this.handleRecordClick}
            />
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
              onRerecord={() => this.rerecord(i)}
            />
          ))}
          sentences={clips.map(({ sentence: { text } }) => text)}
          type="speak"
        />
      </React.Fragment>
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
