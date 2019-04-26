import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { connect } from 'react-redux';
import { UserClient } from 'common/user-clients';
import API from '../../../services/api';
import { Notifications } from '../../../stores/notifications';
import StateTree from '../../../stores/tree';
import URLS from '../../../urls';
import { LocaleLink } from '../../locale-helpers';
import { ArrowLeft } from '../../ui/icons';
import { Button, LabeledCheckbox, LabeledInput } from '../../ui/ui';

import './subscribe.css';

interface PropsFromState {
  account: UserClient;
  api: API;
}

interface PropsFromDispatch {
  addNotification: typeof Notifications.actions.addPill;
}

interface Props extends PropsFromState, PropsFromDispatch {}

interface State {
  email: string;
  privacyAgreed: boolean;
  submitStatus: null | 'submitting' | 'submitted';
}

class Subscribe extends React.Component<Props, State> {
  state: State = { email: '', privacyAgreed: false, submitStatus: null };

  emailInputRef = React.createRef<HTMLInputElement>();

  handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: event.target.value });
  };

  handlePrivacyAgreedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ privacyAgreed: event.target.checked });
  };

  handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { account, api, addNotification } = this.props;
    this.setState({ submitStatus: 'submitting' });
    try {
      await api.subscribeToNewsletter(
        account ? account.email : this.state.email
      );
      addNotification(
        <Localized id="profile-form-submit-saved">
          <span />
        </Localized>
      );
      this.setState({ submitStatus: 'submitted' });
    } catch (e) {
      addNotification('Subscription failed', 'error');
      console.error(e);
      this.setState({ submitStatus: null });
    }
  };

  render() {
    const { account } = this.props;
    const { submitStatus } = this.state;
    const isEditable = submitStatus == null;
    const email = account ? account.email : this.state.email;
    const privacyAgreed = account || this.state.privacyAgreed;
    const emailInput = this.emailInputRef.current;

    if ((account && account.basket_token) || submitStatus == 'submitted') {
      return null;
    }

    return (
      <div className="dataset-subscribe">
        <Localized id="want-dataset-update">
          <h2 />
        </Localized>
        <div>
          <form onSubmit={this.handleSubmit}>
            <Localized id="email-input" attrs={{ label: true }}>
              <LabeledInput
                value={email}
                onChange={this.handleEmailChange}
                disabled={!isEditable || account}
                type="email"
                ref={this.emailInputRef}
              />
            </Localized>

            <Button
              type="submit"
              disabled={
                !isEditable ||
                !privacyAgreed ||
                !email ||
                !emailInput ||
                !emailInput.checkValidity()
              }>
              <Localized id="subscribe">
                <span className="hidden-md-down" />
              </Localized>
              <ArrowLeft className="hidden-lg-up" />
            </Button>
          </form>
          <LabeledCheckbox
            label={
              <Localized
                id="accept-privacy"
                privacyLink={<LocaleLink to={URLS.PRIVACY} blank />}>
                <span />
              </Localized>
            }
            disabled={!isEditable}
            checked={privacyAgreed}
            onChange={this.handlePrivacyAgreedChange}
          />
        </div>
      </div>
    );
  }
}

export default connect<PropsFromState, PropsFromDispatch>(
  ({ api, user }: StateTree) => ({
    account: user.account,
    api,
  }),
  { addNotification: Notifications.actions.addPill }
)(Subscribe);
