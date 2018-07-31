import { LocalizationProps, Localized, withLocalization } from 'fluent-react';
import * as React from 'react';
import { connect } from 'react-redux';
import Modal from '../../modal/modal';
import { CardAction, Button, Hr, LabeledInput } from '../../ui/ui';
import StateTree from '../../../stores/tree';
import { User } from '../../../stores/user';
import { KioskProgress } from '../../../stores/kioskProgress';
import { DownloadIcon } from '../../ui/icons';
import PrivacyInfo from '../../privacy-info';
import URLS from '../../../urls';
import { RouteComponentProps, withRouter } from 'react-router';

import './kiosk.css';

interface PropsFromState {
  user: User.State;
  kioskProgress: KioskProgress.State;
}

interface PropsFromDispatch {
  updateUser: typeof User.actions.update;
  clearUser: typeof User.actions.clear;
  startKiosk: typeof KioskProgress.actions.start;
  nextKiosk: typeof KioskProgress.actions.next;
}

interface KioskProps
  extends LocalizationProps,
    PropsFromState,
    PropsFromDispatch,
    RouteComponentProps<any> {}

class KioskPage extends React.Component<KioskProps> {
  state = {
    email: this.props.user.email,
  };

  private update = ({ target }: any) => {
    this.setState({
      [target.name]: target.value,
    } as any);
  };

  private save = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { email } = this.state;
    this.props.updateUser({
      email: email,
      sendEmails: true,
      privacyAgreed: true,
    });
    this.props.nextKiosk(KioskProgress.Status.emailSubmitted);
  };

  private wizardFinish = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.nextKiosk(KioskProgress.Status.wizardCompleted);
    this.props.history.push(URLS.SPEAK);
  };

  private contribFinish = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.nextKiosk(KioskProgress.Status.nothingDone);
    this.props.history.push(URLS.KIOSK);
  };

  constructor(props: KioskProps) {
    super(props);

    if (
      this.props.kioskProgress.kioskState < KioskProgress.Status.wizardCompleted
    ) {
      this.state.email = '';
      this.props.clearUser();
    }
  }

  render() {
    const { kioskState } = this.props.kioskProgress;
    const { email } = this.state;

    return (
      <div id="kiosk-container">
        <div id="common-voice-kiosk">
          <Localized id="kiosk-wizard-welcome">
            <h1 />
          </Localized>
        </div>

        {kioskState == KioskProgress.Status.listeningCompleted && (
          <form onSubmit={this.contribFinish}>
            <br />

            <Localized id="kiosk-wizard-congrats">
              <h3 />
            </Localized>

            <Hr />

            <Localized id="kiosk-wizard-finish">
              <Button type="submit" rounded />
            </Localized>
          </form>
        )}

        {kioskState == KioskProgress.Status.wizardCompleted && (
          <Localized id="kiosk-wizard-continue">
            <h2 />
          </Localized>
        )}

        {kioskState == KioskProgress.Status.nothingDone && (
          <div>
            <Localized id="kiosk-wizard-start">
              <h2 />
            </Localized>

            <form onSubmit={this.save}>
              <br />

              <Localized id="kiosk-email-value" attrs={{ label: true }}>
                <LabeledInput
                  label="Email"
                  name="email"
                  required
                  type="email"
                  value={email}
                  onChange={this.update}
                />
              </Localized>

              <Hr />

              <div className="center">
                <Localized id="kiosk-email-submit">
                  <Button disabled={!email} type="submit" rounded />
                </Localized>
                <div />
              </div>

              <br />

              <PrivacyInfo localizedPrefix="get-involved-" />
            </form>
          </div>
        )}

        {kioskState == KioskProgress.Status.emailSubmitted && (
          <form onSubmit={this.wizardFinish}>
            <br />

            <Localized id="kiosk-wizard-intro">
              <h3 />
            </Localized>

            <Hr />

            <Localized id="kiosk-wizard-submit">
              <Button type="submit" rounded />
            </Localized>
          </form>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: StateTree) => ({
  user: state.user,
  kioskProgress: state.kioskProgress,
});

const mapDispatchToProps = {
  updateUser: User.actions.update,
  clearUser: User.actions.clear,
  startKiosk: KioskProgress.actions.start,
  nextKiosk: KioskProgress.actions.next,
};

export default withRouter(
  connect<PropsFromState, PropsFromDispatch>(
    mapStateToProps,
    mapDispatchToProps
  )(withLocalization(KioskPage))
);
