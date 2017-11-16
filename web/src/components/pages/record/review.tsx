import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import API from '../../../services/api';
import Tracker from '../../../services/tracker';
import {
  actions as recordingsActions,
  recordingsCountSelector,
  SentenceRecordings,
} from '../../../stores/recordings';
import StateTree from '../../../stores/tree';
import {
  actions as userActions,
  apiSelector,
  UserState,
} from '../../../stores/user';
import ListenBox from '../../listen-box/listen-box';
import Modal from '../../modal/modal';
import ProgressButton from '../../progress-button';
import ProfileActions from './profile-actions';

interface PropsFromState {
  api: API;
  recordingsCount: number;
  sentenceRecordings: SentenceRecordings;
  user: UserState;
}

interface PropsFromDispatch {
  buildNewSentenceSet: typeof recordingsActions.buildNewSentenceSet;
  tallyRecording: typeof userActions.tallyRecording;
  updateUser: typeof userActions.update;
}

interface Props
  extends PropsFromState,
    PropsFromDispatch,
    RouteComponentProps<any> {
  onRedo(sentence: string): any;
}

interface State {
  showPrivacyModal: boolean;
  showResetModal: boolean;
  progress: number;
  uploading: boolean;
}

class Review extends React.Component<Props, State> {
  tracker = new Tracker();

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
  };

  private closeResetModal = () => {
    this.setState({ showResetModal: false });
  };

  private handleSubmit = async () => {
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
      this.tracker.trackSubmitRecordings();
    } catch (e) {
      this.setState({
        uploading: false,
      });
      this.setState({ showResetModal: true });
    }
  };

  render() {
    const { uploading, showPrivacyModal, showResetModal } = this.state;
    return (
      <div id="voice-submit">
        {showPrivacyModal && (
          <Modal
            buttons={{
              'I agree': () => this.handlePrivacyAction(true),
              'I do not agree': () => this.handlePrivacyAction(false),
            }}>
            By using Common Voice, you agree to our{' '}
            <a target="_blank" href="/terms">
              Terms
            </a>{' '}
            and{' '}
            <a target="_blank" href="/privacy">
              Privacy Notice
            </a>.
          </Modal>
        )}
        {showResetModal && (
          <Modal
            buttons={{
              'Keep the recordings': this.closeResetModal,
              'Delete my recordings': this.resetAndGoHome,
            }}>
            Upload aborted. Do you want to delete your recordings?
          </Modal>
        )}
        <div id="voice-submit-review">
          <h2>Review &amp; Submit</h2>
          <br />
          <p>
            Thank you for recording!<br />
            Now review and submit your clips below.
          </p>
        </div>
        <p id="box-headers">
          <span>Review</span>
          <span>Re-record</span>
        </p>
        {Object.entries(
          this.props.sentenceRecordings
        ).map(([sentence, recording]) => (
          <ListenBox
            key={sentence}
            src={recording.url}
            onDelete={this.props.onRedo.bind(this, sentence)}
            sentence={sentence}
          />
        ))}
        <br />
        <ProgressButton
          percent={uploading ? 100 : 0}
          disabled={uploading}
          onClick={this.handleSubmit}
          text="SUBMIT"
        />
        <ProfileActions />
      </div>
    );
  }
}

const mapStateToProps = ({ recordings, user }: StateTree) => ({
  api: apiSelector(user),
  recordingsCount: recordingsCountSelector(recordings),
  sentenceRecordings: recordings.sentenceRecordings,
  user,
});

const mapDispatchToProps = {
  buildNewSentenceSet: recordingsActions.buildNewSentenceSet,
  tallyRecording: userActions.tallyRecording,
  updateUser: userActions.update,
};

export default withRouter(
  connect<PropsFromState, PropsFromDispatch>(
    mapStateToProps,
    mapDispatchToProps
  )(Review)
);
