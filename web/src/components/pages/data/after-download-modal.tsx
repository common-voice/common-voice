import { Localized } from 'fluent-react';
import * as React from 'react';
import { connect } from 'react-redux';
import { trackDataset } from '../../../services/tracker';
import StateTree from '../../../stores/tree';
import { User } from '../../../stores/user';
import Modal from '../../modal/modal';
import PrivacyInfo from '../../privacy-info';
import { SuccessIcon } from '../../ui/icons';
import { Button, LabeledInput, TextButton } from '../../ui/ui';

const AUTO_HIDE_TIME_MS = 5000;

interface PropsFromState {
  user: User.State;
}

interface PropsFromDispatch {
  updateUser: typeof User.actions.update;
}

interface Props extends PropsFromState, PropsFromDispatch {
  onRequestClose: () => void;
  titleOnly: boolean;
}

interface State {
  email: string;
  isSubmitted: boolean;
}

class AfterDownloadModal extends React.Component<Props, State> {
  state = { email: this.props.user.email, isSubmitted: false };
  timeout: any;

  componentDidMount() {
    const { onRequestClose, titleOnly } = this.props;
    if (titleOnly) {
      this.timeout = setTimeout(onRequestClose, AUTO_HIDE_TIME_MS);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  handleSubmit = (event: React.FormEvent<any>) => {
    event.preventDefault();
    trackDataset('post-download-signup');
    this.props.updateUser({
      email: this.state.email,
      sendEmails: true,
    });
    this.setState({ isSubmitted: true });
  };

  render() {
    const { onRequestClose, titleOnly } = this.props;
    const { email, isSubmitted } = this.state;
    return (
      <Modal
        {...{ onRequestClose }}
        innerClassName={'email-modal ' + (titleOnly ? 'compact' : '')}>
        <div className="head">
          <SuccessIcon />
          <Localized id="download-title">
            <h2 />
          </Localized>
        </div>

        {!titleOnly && (
          <React.Fragment>
            <form onSubmit={this.handleSubmit}>
              <Localized id="download-helpus">
                <p />
              </Localized>

              <Localized
                id="download-form-email"
                attrs={{ label: !isSubmitted, value: isSubmitted }}>
                <LabeledInput
                  label={isSubmitted ? '' : 'Enter your email'}
                  type={isSubmitted ? 'text' : 'email'}
                  value={isSubmitted ? "Thank you, we'll be in touch." : email}
                  disabled={isSubmitted}
                  onChange={(event: any) => {
                    this.setState({ email: event.target.value });
                  }}
                />
              </Localized>

              {!isSubmitted && (
                <Localized id="submit-form-action">
                  <Button type="submit" outline />
                </Localized>
              )}

              <TextButton onClick={onRequestClose} className="cancel">
                {isSubmitted ? (
                  <Localized id="download-back">
                    <span />
                  </Localized>
                ) : (
                  <Localized id="download-no">
                    <span />
                  </Localized>
                )}
              </TextButton>

              {isSubmitted && <br />}

              <PrivacyInfo />
            </form>
          </React.Fragment>
        )}
      </Modal>
    );
  }
}

const mapStateToProps = (state: StateTree) => ({
  user: state.user,
});

const mapDispatchToProps = {
  updateUser: User.actions.update,
};

export default connect<PropsFromState, PropsFromDispatch>(
  mapStateToProps,
  mapDispatchToProps
)(AfterDownloadModal);
