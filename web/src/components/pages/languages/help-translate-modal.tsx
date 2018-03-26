const { Localized } = require('fluent-react');
import * as React from 'react';
import { connect } from 'react-redux';
import Modal from '../../modal/modal';
import { CloseIcon, SuccessIcon } from '../../ui/icons';
import { Button, Hr, LabeledInput } from '../../ui/ui';
import StateTree from '../../../stores/tree';
import { User } from '../../../stores/user';
import PrivacyInfo from '../../privacy-info';

interface PropsFromState {
  user: User.State;
}

interface PropsFromDispatch {
  updateUser: typeof User.actions.update;
}

interface Props extends PropsFromState, PropsFromDispatch {
  locale: {
    code?: string;
    name: string;
  };
  onRequestClose: () => void;
}

interface State {
  email: string;
  isExpanded: boolean;
  isSubmitted: boolean;
  sendEmails: boolean;
}

class RequestLanguageModal extends React.Component<Props, State> {
  state: State = {
    email: this.props.user.email,
    isExpanded: false,
    isSubmitted: false,
    sendEmails: this.props.user.sendEmails,
  };

  private update = ({ target }: any) => {
    this.setState({
      [target.name]: target.type === 'checkbox' ? target.checked : target.value,
    });
  };

  private save = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { email, sendEmails } = this.state;
    this.props.updateUser({ email, sendEmails });
    this.setState({ isSubmitted: true });
  };

  render() {
    const { locale } = this.props;
    const { email, isExpanded, isSubmitted, sendEmails } = this.state;

    return (
      <Modal innerClassName="help-translate-modal">
        <Localized id="help-translate-cancel">
          <a
            className="cancel"
            href="javascript:void(0)"
            onClick={this.props.onRequestClose}
          />
        </Localized>

        <br />

        <Localized id="help-translate-title" $language={locale.name}>
          <h2 />
        </Localized>

        <br />

        <Localized
          id="help-translate-text"
          pontoonLink={
            <a
              href="https://pontoon.mozilla.org/"
              target="_blank"
              rel="noopener noreferrer"
            />
          }>
          <p />
        </Localized>

        <br />

        <div className="center">
          <Localized id="help-translate-link">
            <Button
              rounded
              style={{ maxWidth: 300, width: '100%' }}
              onClick={() =>
                window.open(
                  `https://pontoon.mozilla.org/${locale.code}/common-voice`,
                  '_blank'
                )
              }
            />
          </Localized>
        </div>

        <br />

        <div
          className={'title-and-action' + (isExpanded ? '' : ' collapsed')}
          onClick={() => this.setState({ isExpanded: !isExpanded })}>
          {isExpanded && isSubmitted ? (
            <h4 />
          ) : isSubmitted ? (
            <Localized
              id="language-updates-success-collapsed-title"
              $language={locale.name}>
              <h4 />
            </Localized>
          ) : (
            <Localized id="language-updates-title" $language={locale.name}>
              <h4 />
            </Localized>
          )}

          {isExpanded || !isSubmitted ? (
            <CloseIcon black className="toggle" />
          ) : (
            <SuccessIcon />
          )}
        </div>

        {isExpanded &&
          (isSubmitted ? (
            <div className="signup-success">
              <SuccessIcon />

              <Localized
                id="language-updates-success-title"
                $language={locale.name}>
                <h2 />
              </Localized>

              <br />

              <Localized id="language-updates-success-text">
                <p className="small" />
              </Localized>

              <br />
            </div>
          ) : (
            <form onSubmit={this.save}>
              <br />

              <Localized id="email-input" attrs={{ label: true }}>
                <LabeledInput
                  label="Email"
                  name="email"
                  required
                  type="email"
                  value={email}
                  onChange={this.update}
                />
              </Localized>

              <label className="opt-in">
                <input
                  name="sendEmails"
                  type="checkbox"
                  checked={sendEmails}
                  onChange={this.update}
                />
                <Localized id="yes-receive-emails">
                  <span />
                </Localized>
              </label>

              <Hr />

              <div className="center">
                <Localized id="submit-form-action">
                  <Button disabled={!email} type="submit" rounded />
                </Localized>
                <div />
              </div>

              <br />

              <PrivacyInfo />
            </form>
          ))}
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
)(RequestLanguageModal);
