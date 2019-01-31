import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { connect } from 'react-redux';
import { UserClient } from 'common/user-clients';
import StateTree from '../../../stores/tree';
import URLS from '../../../urls';
import { LocaleLink } from '../../locale-helpers';
import { ArrowLeft } from '../../ui/icons';
import { Button, LabeledCheckbox, LabeledInput } from '../../ui/ui';

import './subscribe.css';

interface PropsFromState {
  account: UserClient;
}

interface State {
  email: string;
  privacyAgreed: boolean;
  submitStatus: null | 'submitting' | 'submitted';
}

class Subscribe extends React.Component<PropsFromState, State> {
  state: State = { email: '', privacyAgreed: false, submitStatus: null };

  emailInputRef = React.createRef<HTMLInputElement>();

  handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: event.target.value });
  };

  handlePrivacyAgreedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ privacyAgreed: event.target.checked });
  };

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.setState({ submitStatus: 'submitted' });
  };

  render() {
    const { account } = this.props;
    const { submitStatus } = this.state;
    const isEditable = submitStatus == null;
    const email = account ? account.email : this.state.email;
    const privacyAgreed = account || this.state.privacyAgreed;
    const emailInput = this.emailInputRef.current;
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

export default connect<PropsFromState>(({ user }: StateTree) => ({
  account: user.account,
}))(Subscribe);
