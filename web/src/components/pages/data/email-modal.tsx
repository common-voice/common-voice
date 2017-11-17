import * as React from 'react';
import { connect } from 'react-redux';
import StateTree from '../../../stores/tree';
import { User } from '../../../stores/user';
import Modal from '../../modal/modal';
import { SuccessIcon } from '../../ui/icons';
import { LabeledInput } from '../../ui/ui';
import { FormEvent } from 'react';

interface PropsFromState {
  user: User.State;
}

interface PropsFromDispatch {
  updateUser: typeof User.actions.update;
}

interface Props extends PropsFromState, PropsFromDispatch {
  onRequestClose: () => void;
}

interface State {
  email: string;
  isSubmitted: boolean;
}

class EmailModal extends React.Component<Props, State> {
  state = { email: this.props.user.email, isSubmitted: false };

  handleSubmit = (event: FormEvent<any>) => {
    event.preventDefault();
    this.props.updateUser({
      email: this.state.email,
      sendEmails: true,
    });
    this.setState({ isSubmitted: true });
  };

  render() {
    const { onRequestClose } = this.props;
    const { email, isSubmitted } = this.state;
    return (
      <Modal {...{ onRequestClose }} innerClassName="email-modal">
        <div className="head">
          <SuccessIcon />
          <h2>Your download has started.</h2>
        </div>

        <form onSubmit={this.handleSubmit}>
          <p>
            Help us build a community around voice technology, stay in touch via
            email.
          </p>

          <LabeledInput
            label={isSubmitted ? '' : 'Enter your email'}
            type="email"
            value={isSubmitted ? "Thank you, we'll be in touch." : email}
            disabled={isSubmitted}
            onChange={(event: any) =>
              this.setState({ email: event.target.value })}
          />

          {!isSubmitted && <button type="submit">Submit</button>}

          <a onClick={onRequestClose} className="cancel">
            {isSubmitted ? 'Return to Common Voice Datasets' : 'No Thanks'}
          </a>

          <p className="fine-print">
            We at Mozilla are building a community around voice technology. We
            would like to stay in touch with updates, new data sources and to
            hear more about how you're using this data.
          </p>
          <br />

          <p className="fine-print">
            We promise to handle your information with care. Read more in our{' '}
            <a href="/privacy" target="__blank" rel="noopener noreferrer">
              Privacy Notice
            </a>.
          </p>
        </form>
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
)(EmailModal);
