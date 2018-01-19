import * as React from 'react';
const { Fragment } = require('react');
import { connect } from 'react-redux';
import { trackDataset } from '../../../services/tracker';
import StateTree from '../../../stores/tree';
import { User } from '../../../stores/user';
import Modal from '../../modal/modal';
import { SuccessIcon } from '../../ui/icons';
import { Button, LabeledInput } from '../../ui/ui';

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
          <h2>Your download has started.</h2>
        </div>

        {!titleOnly && (
          <Fragment>
            <form onSubmit={this.handleSubmit}>
              <p>
                Help us build a community around voice technology, stay in touch
                via email.
              </p>

              <LabeledInput
                label={isSubmitted ? '' : 'Enter your email'}
                type={isSubmitted ? 'text' : 'email'}
                value={isSubmitted ? "Thank you, we'll be in touch." : email}
                disabled={isSubmitted}
                onChange={(event: any) => {
                  this.setState({ email: event.target.value });
                }}
              />

              {!isSubmitted && (
                <Button type="submit" outline>
                  Submit
                </Button>
              )}

              <a
                href="javascript:void(0)"
                onClick={onRequestClose}
                className="cancel">
                {isSubmitted ? 'Return to Common Voice Datasets' : 'No Thanks'}
              </a>

              {isSubmitted && <br />}

              <p className="fine-print">
                We at Mozilla are building a community around voice technology.
                We would like to stay in touch with updates, new data sources
                and to hear more about how you're using this data.
              </p>
              <br />

              <p className="fine-print">
                We promise to handle your information with care. Read more in
                our{' '}
                <a href="/privacy" target="__blank" rel="noopener noreferrer">
                  Privacy Notice
                </a>.
              </p>
            </form>
          </Fragment>
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
