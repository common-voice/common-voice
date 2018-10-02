import {
  LocalizationProps,
  Localized,
  withLocalization,
} from 'fluent-react/compat';
import * as React from 'react';
import { connect } from 'react-redux';
import { UserClient } from '../../../../../../common/user-clients';
import API from '../../../../services/api';
import StateTree from '../../../../stores/tree';
import { User } from '../../../../stores/user';
import { Hr, LinkButton, LabeledInput } from '../../../ui/ui';

import './preferences.css';

const Section = ({
  title,
  className = '',
  children,
  ...props
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <section className={'user-preference ' + className} {...props}>
    <h2>{title}</h2>
    <div className="section-body">{children}</div>
  </section>
);

interface PropsFromState {
  account: UserClient;
  api: API;
}

interface PropsFromDispatch {
  refreshUser: typeof User.actions.refresh;
}

interface Props extends LocalizationProps, PropsFromState, PropsFromDispatch {}

class Preferences extends React.Component<Props> {
  syncSkipSubmissionFeedback = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.api.saveAccount({
      skip_submission_feedback: event.target.checked,
    });
  };

  render() {
    const { account, getString } = this.props;
    const firstLanguage = account.locales[0];
    return (
      <div>
        <Section title={getString('login-identity')} className="two-columns">
          <Localized id="email-input" attrs={{ label: true }}>
            <LabeledInput value={account.email} disabled />
          </Localized>

          <Localized id="edit">
            <LinkButton
              outline
              className="edit-button"
              href={location.origin + '/login?change_email'}
            />
          </Localized>
        </Section>

        <Section title={getString('email-subscriptions')}>
          {account.basket_token ? (
            <a
              href={`https://www.mozilla.org/${
                firstLanguage ? firstLanguage.locale + '/' : ''
              }newsletter/existing/${account.basket_token}`}>
              Manage email settings
            </a>
          ) : (
            <React.Fragment />
          )}
        </Section>

        <Section title={getString('contribution-experience')} className="box">
          <Localized id="skip-submission-feedback">
            <h3 className="feedback-toggle-title" />
          </Localized>
          <div className="feedback-toggle">
            <input
              type="checkbox"
              onChange={this.syncSkipSubmissionFeedback}
              defaultChecked={account.skip_submission_feedback}
            />
            <Localized id="off">
              <div />
            </Localized>
            <Localized id="on">
              <div />
            </Localized>
          </div>
          <Localized id="skip-submission-description">
            <p className="skip-submission-description" />
          </Localized>
          <Localized id="skip-submission-note">
            <p className="skip-submission-note" />
          </Localized>
        </Section>
      </div>
    );
  }
}

export default connect<PropsFromState, PropsFromDispatch>(
  ({ api, user }: StateTree) => ({
    account: user.account,
    api,
  }),
  {
    refreshUser: User.actions.refresh,
  }
)(withLocalization(Preferences));
