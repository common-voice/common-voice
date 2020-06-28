import { Localized } from '@fluent/react';
import * as React from 'react';
import { connect } from 'react-redux';
import URLS from '../../../urls';
import { LocaleLink } from '../../locale-helpers';
import { ArrowLeft } from '../../ui/icons';
import { Button, LabeledCheckbox, LabeledInput } from '../../ui/ui';
import {
  SubscribeMapDispatchToProps,
  SubscribeMapStateToProps,
  SubscribePropsFromDispatch,
  SubscribePropsFromState,
  SubscribeProps,
} from './types';
import './subscribe.css';
import { Link } from 'react-router-dom';

interface State {
  email: string;
  privacyAgreed: boolean;
  submitStatus: null | 'submitting' | 'submitted';
}

class Subscribe extends React.Component<SubscribeProps, State> {
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
    const { account, demoMode } = this.props;
    const { submitStatus } = this.state;
    const isEditable = submitStatus == null;
    const email = account ? account.email : this.state.email;
    const privacyAgreed = account || this.state.privacyAgreed;
    const emailInput = this.emailInputRef.current;

    if (account?.basket_token || submitStatus == 'submitted') {
      return null;
    }

    return (
      <div className="dataset-subscribe">
        <Localized id="want-dataset-update">
          <h2 />
        </Localized>
        <div>
          <form onSubmit={this.handleSubmit} id="subscribe-form">
            <Localized id="email-input" attrs={{ label: true }}>
              <LabeledInput
                value={email}
                onChange={this.handleEmailChange}
                disabled={!isEditable || account}
                type="email"
                required
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
              {!demoMode && (
                <Localized id="subscribe">
                  <span className="hidden-md-down" />
                </Localized>
              )}
              <ArrowLeft className={demoMode ? '' : 'hidden-lg-up'} />
            </Button>
          </form>
          <LabeledCheckbox
            label={
              <Localized
                id="accept-privacy"
                elems={{ privacyLink: <LocaleLink to={URLS.PRIVACY} blank /> }}>
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

export default connect<SubscribePropsFromState, SubscribePropsFromDispatch>(
  SubscribeMapStateToProps,
  SubscribeMapDispatchToProps
)(Subscribe);
