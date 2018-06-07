import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { LocalizationProps, Localized, withLocalization } from 'fluent-react';
import API from '../../../services/api';
import { trackRecording } from '../../../services/tracker';
import { Locale } from '../../../stores/locale';
import { Recordings } from '../../../stores/recordings';
import StateTree from '../../../stores/tree';
import { User } from '../../../stores/user';
import ListenBox from '../../listen-box/listen-box';
import Modal from '../../modal/modal';
import ProgressButton from '../../progress-button';
import { TextButton } from '../../ui/ui';
import ProfileActions from './profile-actions';

interface PropsFromState {
  api: API;
  locale: Locale.State;
  recordingsCount: number;
  sentenceRecordings: Recordings.SentenceRecording[];
  user: User.State;
}

interface PropsFromDispatch {
  buildNewSentenceSet: typeof Recordings.actions.buildNewSentenceSet;
  setReRecordSentence: typeof Recordings.actions.setReRecordSentence;
  tallyRecording: typeof User.actions.tallyRecording;
  updateUser: typeof User.actions.update;
}

interface Props
  extends LocalizationProps,
    PropsFromState,
    PropsFromDispatch,
    RouteComponentProps<any> {}

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
    this.setState({
      uploading: true,
    });

    try {
      await this.ensurePrivacyAgreement();

      const {
        api,
        locale,
        recordingsCount,
        sentenceRecordings,
        tallyRecording,
      } = this.props;

      let i = 0;
      for (const { sentence, recording } of sentenceRecordings) {
        await api.uploadClip(recording.blob, sentence.id, sentence.text);

        tallyRecording();

        this.setState({
          progress: Math.floor((i + 1) / recordingsCount * 100),
        });

        i++;
      }
      await this.props.api.syncDemographics();
      this.props.buildNewSentenceSet();
      trackRecording('submit', locale);
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
    const { getString, sentenceRecordings } = this.props;
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
                [getString('terms-agree')]: () =>
                  this.handlePrivacyAction(true),
                [getString('terms-disagree')]: () =>
                  this.handlePrivacyAction(false),
              }}
            />
          </Localized>
        )}
        {showResetModal && (
          <Localized id="review-aborted">
            <Modal
              buttons={{
                [getString('review-keep-recordings')]: this.toggleResetModal,
                [getString('review-delete-recordings')]: this.resetAndGoHome,
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
        {sentenceRecordings.map(({ sentence, recording }) => (
          <ListenBox
            key={sentence.id}
            src={recording.url}
            onDelete={this.rerecord.bind(this, sentence.id)}
            sentence={sentence.text}
          />
        ))}
        <br />
        <div className="actions">
          <Localized id="review-cancel">
            <TextButton onClick={this.toggleResetModal} />
          </Localized>
          <Localized id="submit-form-action">
            <ProgressButton
              percent={uploading ? progress : 0}
              disabled={uploading}
              onClick={this.handleSubmit}
            />
          </Localized>
        </div>
        <ProfileActions />
      </div>
    );
  }
}

const mapStateToProps = (state: StateTree) => ({
  api: state.api,
  locale: state.locale,
  recordingsCount: Recordings.selectors.recordingsCount(state),
  sentenceRecordings: Recordings.selectors.localeRecordings(state)
    .sentenceRecordings,
  user: state.user,
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
  )(withLocalization(Review))
);
