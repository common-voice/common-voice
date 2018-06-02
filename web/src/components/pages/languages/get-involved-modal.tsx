const { Localized } = require('fluent-react');
import ISO6391 from 'iso-639-1';
import * as React from 'react';
import { connect } from 'react-redux';
import Modal from '../../modal/modal';
import { SuccessIcon } from '../../ui/icons';
import { Button, Hr, LabeledInput, TextButton } from '../../ui/ui';
import { RequestedLanguages } from '../../../stores/requested-languages';
import StateTree from '../../../stores/tree';
import { User } from '../../../stores/user';
import PrivacyInfo from '../../privacy-info';

interface PropsFromState {
  user: User.State;
}

interface PropsFromDispatch {
  createLanguageRequest: typeof RequestedLanguages.actions.create;
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
  isSubmitted: boolean;
  sendEmails: boolean;
}

class GetInvolvedModal extends React.Component<Props, State> {
  state: State = {
    email: this.props.user.email,
    isSubmitted: false,
    sendEmails: this.props.user.sendEmails,
  };

  private update = ({ target }: any) => {
    this.setState({
      [target.name]: target.type === 'checkbox' ? target.checked : target.value,
    } as any);
  };

  private save = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { email } = this.state;
    this.props.createLanguageRequest(this.props.locale.name);
    this.props.updateUser({ email });
    this.setState({ isSubmitted: true });
  };

  render() {
    const { locale, onRequestClose } = this.props;
    const { email, isSubmitted, sendEmails } = this.state;

    const nativeName = ISO6391.getNativeName(locale.code) || locale.name;

    return (
      <Modal
        innerClassName="get-involved-modal"
        onRequestClose={onRequestClose}>
        <br />
        <Localized id="get-involved-title" $lang={nativeName}>
          <h2 />
        </Localized>
        <br />
        <Localized id="get-involved-text" $lang={nativeName} lineBreak={<br />}>
          <p />
        </Localized>
        <br />
        <div className="title-and-action">
          {!isSubmitted && (
            <Localized id="get-involved-form-title" $lang={nativeName}>
              <h4 />
            </Localized>
          )}
        </div>
        {isSubmitted ? (
          <div className="signup-success">
            <SuccessIcon />

            <Localized id="get-involved-success-title" $language={nativeName}>
              <h2 />
            </Localized>

            <br />

            <Localized id="get-involved-success-text">
              <p className="small" />
            </Localized>

            <br />

            <Localized id="get-involved-return-to-languages">
              <Button rounded onClick={onRequestClose} />
            </Localized>
          </div>
        ) : (
          <form onSubmit={this.save}>
            <br />

            <Localized id="get-involved-email" attrs={{ label: true }}>
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
              <Localized id="get-involved-opt-in">
                <span />
              </Localized>
            </label>

            <Hr />

            <div className="center">
              <Localized id="get-involved-submit">
                <Button
                  disabled={!email || !sendEmails}
                  type="submit"
                  rounded
                />
              </Localized>
              <div />
            </div>

            <br />

            <PrivacyInfo localizedPrefix="get-involved-" />
          </form>
        )}
      </Modal>
    );
  }
}

const mapStateToProps = (state: StateTree) => ({
  user: state.user,
});

const mapDispatchToProps = {
  createLanguageRequest: RequestedLanguages.actions.create,
  updateUser: User.actions.update,
};

export default connect<PropsFromState, PropsFromDispatch>(
  mapStateToProps,
  mapDispatchToProps
)(GetInvolvedModal);
