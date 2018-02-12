import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
const { Localized } = require('fluent-react');
import API from '../../../services/api';
import { trackRecording } from '../../../services/tracker';
import { Recordings } from '../../../stores/recordings';
import StateTree from '../../../stores/tree';
import { User } from '../../../stores/user';
import ListenBox from '../../listen-box/listen-box';
import Modal from '../../modal/modal';
import ProgressButton from '../../progress-button';
import AudioWeb from './audio-web';
import AudioIOS from './audio-ios';
import ProfileActions from './profile-actions';

interface PropsFromState {
  api: API;
  recordingsCount: number;
  sentenceRecordings: Recordings.SentenceRecordings;
  user: User.State;
}

interface PropsFromDispatch {
  buildNewSentenceSet: typeof Recordings.actions.buildNewSentenceSet;
  setReRecordSentence: typeof Recordings.actions.setReRecordSentence;
  tallyRecording: typeof User.actions.tallyRecording;
  updateUser: typeof User.actions.update;
}

interface Props
  extends PropsFromState,
    PropsFromDispatch,
    RouteComponentProps<any> {
  audio: AudioWeb | AudioIOS;
}

interface State {
  showPrivacyModal: boolean;
  showResetModal: boolean;
  progress: number;
  uploading: boolean;
}

class Review extends React.Component<Props, State> {
  state = {
    showPrivacyModal: false,
    showResetModal: false,
    progress: 0,
    uploading: false,
  };

  private handlePrivacyAction(didAgree: boolean): void {}

  private ensurePrivacyAgreement(): Promise<void> {
    if (this.props.user.privacyAgreed) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      this.handlePrivacyAction = (didAgree: boolean): void => {
        this.handlePrivacyAction = null;
        this.setState({
          showPrivacyModal: false,
        });

        if (didAgree) {
          this.props.updateUser({ privacyAgreed: true });
          resolve();
        } else {
          reject();
        }
      };
      this.setState({
        showPrivacyModal: true,
      });
    });
  }

  private resetAndGoHome = () => {
    this.props.buildNewSentenceSet();
    this.props.history.push('/');
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  private toggleResetModal = () => {
    this.setState({ showResetModal: !this.state.showResetModal });
  };

  private rerecord = (sentence: string) => {
    this.props.setReRecordSentence(sentence);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  private handleSubmit = async () => {
    this.props.audio.release();
    this.setState({
      uploading: true,
    });

    try {
      await this.ensurePrivacyAgreement();

      const {
        api,
        recordingsCount,
        sentenceRecordings,
        tallyRecording,
      } = this.props;

      let i = 0;
      for (const [sentence, recording] of Object.entries(sentenceRecordings)) {
        await api.uploadAudio(recording.blob, sentence);

        tallyRecording();

        this.setState({
          progress: Math.floor((i + 1) / recordingsCount * 100),
        });

        i++;
      }
      await this.props.api.uploadDemographicInfo();
      this.props.buildNewSentenceSet();
      trackRecording('submit');
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } catch (e) {
      this.setState({
        uploading: false,
      });
      this.setState({ showResetModal: true });
    }
  };

  render() {
    const {
      progress,
      uploading,
      showPrivacyModal,
      showResetModal,
    } = this.state;
    return (
      <div id="voice-submit">
        {showPrivacyModal && (
          <Localized
            id="review-terms"
            termsLink={<a target="_blank" href="/terms" />}
            privacyLink={<a target="_blank" href="/privacy" />}>
            <Modal
              buttons={{
                'I agree': () => this.handlePrivacyAction(true),
                'I do not agree': () => this.handlePrivacyAction(false),
              }}
            />
          </Localized>
        )}
        {showResetModal && (
          <Localized id="review-aborted">
            <Modal
              buttons={{
                'Keep the recordings': this.toggleResetModal,
                'Delete my recordings': this.resetAndGoHome,
              }}
            />
          </Localized>
        )}
        <div id="voice-submit-review">
          <Localized id="review-submit-title">
            <h2 />
          </Localized>
          <br />
          <Localized id="review-submit-msg" lineBreak={<br />}>
            <p />
          </Localized>
        </div>
        <p id="box-headers">
          <Localized id="review-recording">
            <span />
          </Localized>
          <Localized id="review-rerecord">
            <span />
          </Localized>
        </p>
        {Object.entries(this.props.sentenceRecordings).map(
          ([sentence, recording]) => (
            <ListenBox
              key={sentence}
              src={recording.url}
              onDelete={this.rerecord.bind(this, sentence)}
              sentence={sentence}
            />
          )
        )}
        <br />
        <div className="actions">
          <Localized id="review-cancel">
            <a href="javascript:void(0)" onClick={this.toggleResetModal} />
          </Localized>
          <ProgressButton
            percent={uploading ? progress : 0}
            disabled={uploading}
            onClick={this.handleSubmit}
            text="SUBMIT"
          />
        </div>
        <ProfileActions />
      </div>
    );
  }
}

const mapStateToProps = ({ api, recordings, user }: StateTree) => ({
  api,
  recordingsCount: Recordings.selectors.recordingsCount(recordings),
  sentenceRecordings: recordings.sentenceRecordings,
  user,
});

const mapDispatchToProps = {
  buildNewSentenceSet: Recordings.actions.buildNewSentenceSet,
  setReRecordSentence: Recordings.actions.setReRecordSentence,
  tallyRecording: User.actions.tallyRecording,
  updateUser: User.actions.update,
};

export default withRouter(
  connect<PropsFromState, PropsFromDispatch>(
    mapStateToProps,
    mapDispatchToProps
  )(Review)
);
